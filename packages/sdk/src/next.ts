import { type NextApiRequest, type NextApiResponse } from 'next';
import { type NextRequest } from 'next/server';

import { EchoRequestHandler, IServeHandlerOptions } from './handler';
import { Either } from './types';
import { type SupportedFrameworkName } from './types';
import { getResponse } from './utils';

export const frameworkName: SupportedFrameworkName = 'nextjs';

/**
 * In Next.js, serve and register any declared workflows with Echo, making
 * them available to be triggered by events.
 *
 * Supports Next.js 12+, both serverless and edge.
 *
 * @example Next.js <=12 or the pages router can export the handler directly
 * ```ts
 * export default serve({ client: echo });
 * ```
 *
 * @example Next.js >=13 with the `app` dir must export individual methods
 * ```ts
 * export const { GET, POST, PUT } = serve({ client: echo });
 * ```
 */
export const serve = (options: IServeHandlerOptions): any => {
  const echoHandler = new EchoRequestHandler({
    frameworkName,
    ...options,
    handler: (
      requestMethod: 'GET' | 'POST' | 'PUT' | undefined,
      incomingRequest: NextRequest,
      response: NextApiResponse
    ) => {
      const request = incomingRequest as Either<NextApiRequest, NextRequest>;

      const extractHeader = (key: string): string | null | undefined => {
        const header = typeof request.headers.get === 'function' ? request.headers.get(key) : request.headers[key];

        return Array.isArray(header) ? header[0] : header;
      };

      return {
        body: () => (typeof request.json === 'function' ? request.json() : request.body),
        headers: extractHeader,
        method: () => {
          /**
           * `req.method`, though types say otherwise, is not available in Next.js
           * 13 {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers Route Handlers}.
           *
           * Therefore, we must try to set the method ourselves where we know it.
           */
          const method = requestMethod || request.method || '';

          return method;
        },
        queryString: (key, url) => {
          const qs = request.query?.[key] || url.searchParams.get(key);

          return Array.isArray(qs) ? qs[0] : qs;
        },

        url: () => {
          let absoluteUrl: URL | undefined;
          try {
            absoluteUrl = new URL(request.url as string);
          } catch {
            // no-op
          }

          if (absoluteUrl) {
            /**
             * `req.url` here should may be the full URL, including query string.
             * There are some caveats, however, where Next.js will obfuscate
             * the host. For example, in the case of `host.docker.internal`,
             * Next.js will instead set the host here to `localhost`.
             *
             * To avoid this, we'll try to parse the URL from `req.url`, but
             * also use the `host` header if it's available.
             */
            const host = extractHeader('host');
            if (host) {
              const hostWithProtocol = new URL(host.includes('://') ? host : `${absoluteUrl.protocol}//${host}`);

              absoluteUrl.protocol = hostWithProtocol.protocol;
              absoluteUrl.host = hostWithProtocol.host;
              absoluteUrl.port = hostWithProtocol.port;
              absoluteUrl.username = hostWithProtocol.username;
              absoluteUrl.password = hostWithProtocol.password;
            }

            return absoluteUrl;
          }

          let protocol: 'http' | 'https' = 'https';
          const hostHeader = extractHeader('host') || '';

          try {
            if (process.env.NODE_ENV === 'development') {
              protocol = 'http';
            }
          } catch (error) {
            // no-op
          }

          const url = new URL(request.url as string, `${protocol}://${hostHeader}`);

          return url;
        },
        transformResponse: ({ body, headers, status }): Response => {
          /**
           * Carefully attempt to set headers and data on the response object
           * for Next.js 12 support.
           */
          if (typeof response?.setHeader === 'function') {
            Object.entries(headers).forEach(([headerName, headerValue]) => {
              response.setHeader(headerName, headerValue);
            });
          }

          if (typeof response?.status === 'function' && typeof response?.send === 'function') {
            response.status(status).send(body);

            /**
             * If we're here, we're in a serverless endpoint (not edge), so
             * we've correctly sent the response and can return `undefined`.
             *
             * Next.js 13 edge requires that the return value is typed as
             * `Response`, so we still enforce that as we cannot dynamically
             * adjust typing based on the environment.
             */
            return undefined as unknown as Response;
          }

          /**
           * If we're here, we're in an edge environment and need to return a
           * `Response` object.
           *
           * We also don't know if the current environment has a native
           * `Response` object, so we'll grab that first.
           */
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const Res = getResponse();

          return new Res(body, { status, headers });
        },
      };
    },
  });

  /**
   * Next.js 13 uses
   * {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers Route Handlers}
   * to declare API routes instead of a generic catch-all method that was
   * available using the `pages/api` directory.
   *
   * This means that users must now export a function for each method supported
   * by the endpoint. For us, this means requiring a user explicitly exports
   * `GET`, `POST`, and `PUT` functions.
   *
   * Because of this, we'll add circular references to those property names of
   * the returned handler, meaning we can write some succinct code to export
   * cspell:disable-next-line
   * them. Thanks, @goodoldneon.
   *
   * @example
   * ```ts
   * export const { GET, POST, PUT } = serve(...);
   * ```
   *
   * See {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers}
   */
  const baseHandler = echoHandler.createHandler();

  const defaultHandler = baseHandler.bind(null, undefined);
  type HandlerFunction = typeof defaultHandler;

  const handlerFunctions = Object.defineProperties(defaultHandler, {
    GET: { value: baseHandler.bind(null, 'GET') },
    POST: { value: baseHandler.bind(null, 'POST') },
    PUT: { value: baseHandler.bind(null, 'PUT') },
  }) as HandlerFunction & {
    GET: HandlerFunction;
    POST: HandlerFunction;
    PUT: HandlerFunction;
  };

  return handlerFunctions;
};
