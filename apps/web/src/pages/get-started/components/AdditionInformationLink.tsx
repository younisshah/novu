import styled from '@emotion/styled';

import { colors, Text, IconMenuBook } from '@novu/design-system';

import { Link } from '../consts/shared';
import { OnboardingUseCasesTabsEnum } from '../consts/OnboardingUseCasesTabsEnum';
import * as capitalize from 'lodash.capitalize';
import { When } from '../../../components/utils/When';

interface IAdditionInformationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  channel: OnboardingUseCasesTabsEnum;
}
export function AdditionInformationLink({ channel, ...linkProps }: IAdditionInformationLinkProps) {
  return (
    <StyledLink {...linkProps}>
      <IconMenuBook />
      <When truthy={channel !== OnboardingUseCasesTabsEnum.ECHO}>
        <StyledText>Learn about {channel}</StyledText>
      </When>
      <When truthy={channel === OnboardingUseCasesTabsEnum.ECHO}>
        <StyledText>Learn more</StyledText>
      </When>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledText = styled(Text)`
  margin-left: 8px;
  color: ${colors.B60};
  line-height: 20px;
`;
