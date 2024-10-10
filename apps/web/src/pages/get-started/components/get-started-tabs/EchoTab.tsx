import { useSegment } from '@novu/shared-web';
import { css, cx } from '../../../../styled-system/css';
import { Flex, styled } from '../../../../styled-system/jsx';
import { OnboardingUseCasesTabsEnum } from '../../consts/OnboardingUseCasesTabsEnum';
import { AdditionInformationLink } from '../AdditionInformationLink';
import { CodeSnippet } from '../CodeSnippet';
import { text, title } from '../../../../styled-system/recipes';
import { IconCellTower, IconCloudQueue, IconCode, IconHealthAndSafety } from '@novu/design-system';
import { DOMAttributes, useEffect } from 'react';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ['nv-echo-terminal']: CustomElement<any>;
    }
  }
}

const link = 'https://docs.novu.co/echo/quickstart';

const COMMAND = 'npx novu-labs@latest echo';

const Text = styled('p', text);
const Title = styled('h2', title);
const SubTitle = styled('h3', title);

const columnText = css({ textStyle: 'text.main', marginTop: '50', maxW: '214px' });
const columnIcon = css({ marginBottom: '50' });
const mainText = css({ textStyle: 'text.main', maxW: '645px' });

export const EchoTab = ({ className }: { className?: string }) => {
  const segment = useSegment();

  const handleDocsLinkClick = () => {
    segment.track(`Additional Info Link - [Get Started]`, { href: link, tab: OnboardingUseCasesTabsEnum.ECHO });
  };

  useEffect(() => {
    if (!document.getElementById('echo-terminal-loader')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/novuhq/docs/echo-terminal.min.js';
      script.id = 'echo-terminal-loader';
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const tabs = document.getElementsByClassName('nv-terminal-tab');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.addEventListener('click', () => {
        segment.track(`Code snippet tab clicked - [Get Started]`, {
          language: tab.innerHTML,
        });
      });
    }
  });

  return (
    <Flex className={className} direction="row" alignItems="center" gap="300">
      <div>
        <Title variant="section" className={css({ marginTop: '100' })}>
          Create notification workflows as code
        </Title>
        <Text variant="secondary" className={cx(css({ marginTop: '50' }), mainText)}>
          With Novu, you write notification workflows in your codebase locally right in your IDE and preview and edit
          the channel-specific content in real-time.
        </Text>
        <Text variant="secondary" className={cx(css({ marginTop: '125', marginBottom: '150' }), mainText)}>
          Integrate React.Email, MJML, and other template engines easily.
        </Text>
        <SubTitle variant="subsection">Try it out now</SubTitle>
        <Text variant="secondary" className={mainText}>
          Open your terminal and launch the development studio
        </Text>
        <CodeSnippet
          command={COMMAND}
          className={cx(
            css({
              maxW: '400px',
              marginTop: '50',
              marginBottom: '250',
            }),
            css({
              '& input': {
                color: 'white !important',
              },
            })
          )}
          onClick={() => {
            segment.track(`Copy Echo command - [Get Started]`);
          }}
        />
        <div className={css({ marginBottom: '300' })}>
          <AdditionInformationLink
            channel={OnboardingUseCasesTabsEnum.ECHO}
            href={link}
            onClick={handleDocsLinkClick}
          />
        </div>
        <Flex gap="150">
          <div>
            <IconCode size={32} className={columnIcon} />
            <SubTitle variant="subsection">Bring your own code</SubTitle>
            <Text variant="secondary" className={columnText}>
              Write the workflows as functions in your codebase, version, and manage via Git.
            </Text>
          </div>
          <div>
            <IconCellTower size={32} className={columnIcon} />
            <SubTitle variant="subsection">Limitless integrations</SubTitle>
            <Text variant="secondary" className={columnText}>
              Use React.email, MJML, or fetch templates from Braze, Hubspot, Sendgrid, more…
            </Text>
          </div>
        </Flex>
        <Flex gap="150" className={css({ marginTop: '150' })}>
          <div>
            <IconHealthAndSafety size={32} className={columnIcon} />
            <SubTitle variant="subsection">Type safety</SubTitle>
            <Text variant="secondary" className={columnText}>
              Bring your own JSON schemas for full, end-to-end validation and type safety.
            </Text>
          </div>
          <div>
            <IconCloudQueue size={32} className={columnIcon} />
            <SubTitle variant="subsection">Sync and build visually</SubTitle>
            <Text variant="secondary" className={columnText}>
              Sync local workflows with Novu Cloud and ease collaboration using the web editor.
            </Text>
          </div>
        </Flex>
      </div>
      <div>
        <nv-echo-terminal></nv-echo-terminal>
      </div>
    </Flex>
  );
};
