import { Injectable } from '@nestjs/common';
import {
  ChangeRepository,
  DalException,
  MessageTemplateRepository,
} from '@novu/dal';
import { ChangeEntityTypeEnum, WorkflowTypeEnum } from '@novu/shared';

import { DeleteMessageTemplateCommand } from './delete-message-template.command';
import { CreateChange, CreateChangeCommand } from '../../create-change';
import { ApiException } from '../../../utils/exceptions';

@Injectable()
export class DeleteMessageTemplate {
  constructor(
    private messageTemplateRepository: MessageTemplateRepository,
    private createChange: CreateChange,
    private changeRepository: ChangeRepository
  ) {}

  async execute(command: DeleteMessageTemplateCommand): Promise<boolean> {
    try {
      await this.messageTemplateRepository.delete({
        _environmentId: command.environmentId,
        _id: command.messageTemplateId,
      });

      const changeId = await this.changeRepository.getChangeId(
        command.environmentId,
        ChangeEntityTypeEnum.MESSAGE_TEMPLATE,
        command.messageTemplateId
      );

      const deletedMessageTemplate =
        await this.messageTemplateRepository.findDeleted({
          _environmentId: command.environmentId,
          _id: command.messageTemplateId,
        });

      if (command.workflowType !== WorkflowTypeEnum.ECHO) {
        await this.createChange.execute(
          CreateChangeCommand.create({
            changeId,
            organizationId: command.organizationId,
            environmentId: command.environmentId,
            userId: command.userId,
            item: deletedMessageTemplate[0],
            type: ChangeEntityTypeEnum.MESSAGE_TEMPLATE,
            parentChangeId: command.parentChangeId,
          })
        );
      }

      return true;
    } catch (error) {
      if (error instanceof DalException) {
        throw new ApiException(error.message);
      }
      throw error;
    }
  }
}
