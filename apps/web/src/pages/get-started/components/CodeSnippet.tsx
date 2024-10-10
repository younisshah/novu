import { Input, inputStyles } from '@novu/design-system';
import { useClipboard } from '@mantine/hooks';
import { css, cx } from '../../../styled-system/css';
import { ClipboardIconButton } from '../../../components';

const codeValueInputClassName = css({
  '& input': {
    border: 'none !important',
    background: 'surface.popover !important',
    color: 'typography.text.secondary !important',
    fontFamily: 'mono !important',
  },
});

interface ICodeSnippetProps {
  command: string;
  onClick?: () => void;
  className?: string;
  'data-test-id'?: string;
}

/**
 * Read-only code snippet with copy-paste functionality
 */
export const CodeSnippet = ({ command, onClick, className, ...props }: ICodeSnippetProps) => {
  const { copy, copied } = useClipboard();

  const handleCopy = () => {
    onClick?.();
    copy(command);
  };

  return (
    <Input
      readOnly
      className={cx(codeValueInputClassName, className)}
      styles={inputStyles}
      rightSection={
        <ClipboardIconButton isCopied={copied} handleCopy={handleCopy} testId={'mail-server-domain-copy'} size={'16'} />
      }
      value={command}
      data-test-id={props['data-test-id']}
    />
  );
};
