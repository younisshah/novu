import { Module } from '@nestjs/common';
import { USE_CASES } from './usecases';
import { MessageTemplateController } from './message-template.controller';
import { SharedModule } from '../shared/shared.module';
import { ChangeModule } from '../change/change.module';

@Module({
  imports: [SharedModule, ChangeModule],
  controllers: [MessageTemplateController],
  providers: [...USE_CASES],
  exports: [...USE_CASES],
})
export class MessageTemplateModule {}
