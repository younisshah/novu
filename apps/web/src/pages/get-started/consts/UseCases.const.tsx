import { OnboardingUseCases } from './types';
import { InAppUseCaseConst } from './InAppUseCase.const';
import { MultiChannelUseCaseConst } from './MultiChannelUseCase.const';
import { DelayUseCaseConst } from './DelayUseCase.const';
import { TranslationUseCaseConst } from './TranslationUseCase.const';
import { DigestUseCaseConst } from './DigestUseCase.const';
import { OnboardingUseCasesTabsEnum } from './OnboardingUseCasesTabsEnum';

export const UseCasesConst: Omit<OnboardingUseCases, OnboardingUseCasesTabsEnum.ECHO> = {
  [OnboardingUseCasesTabsEnum.IN_APP]: InAppUseCaseConst,
  [OnboardingUseCasesTabsEnum.MULTI_CHANNEL]: MultiChannelUseCaseConst,
  [OnboardingUseCasesTabsEnum.DELAY]: DelayUseCaseConst,
  [OnboardingUseCasesTabsEnum.TRANSLATION]: TranslationUseCaseConst,
  [OnboardingUseCasesTabsEnum.DIGEST]: DigestUseCaseConst,
};
