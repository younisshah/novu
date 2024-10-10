import { join } from 'path';
import { Module } from '@nestjs/common';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  createNestLoggingModuleOptions,
  LoggerModule,
  ProfilingModule,
  TracingModule,
} from '@novu/application-generic';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { HealthModule } from './health/health.module';
import { SocketModule } from './socket/socket.module';

import * as packageJson from '../package.json';

const modules = [
  SharedModule,
  HealthModule,
  TracingModule.register(packageJson.name, packageJson.version),
  ProfilingModule.register(packageJson.name),
  SocketModule,
  LoggerModule.forRoot(
    createNestLoggingModuleOptions({
      serviceName: packageJson.name,
      version: packageJson.version,
    })
  ),
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [AppService];

if (process.env.SENTRY_DSN) {
  modules.push(RavenModule);
  providers.push({
    provide: APP_INTERCEPTOR,
    useValue: new RavenInterceptor(),
  });
}
if (!!process.env.SOCKET_IO_ADMIN_USERNAME && !!process.env.SOCKET_IO_ADMIN_PASSWORD_HASH) {
  modules.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../node_modules/@socket.io/admin-ui/ui/dist'),
      serveRoot: '/admin',
      exclude: ['/api/(.*)'],
    })
  );
}

@Module({
  imports: modules,
  exports: [SocketModule],
  controllers: [AppController],
  providers,
})
export class AppModule {}
