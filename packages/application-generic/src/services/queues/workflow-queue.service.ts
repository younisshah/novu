import { Inject, Injectable, Logger } from '@nestjs/common';
import { JobTopicNameEnum } from '@novu/shared';

import { QueueBaseService } from './queue-base.service';
import { BullMqService } from '../bull-mq';
import { WorkflowInMemoryProviderService } from '../in-memory-provider';
import { IWorkflowBulkJobDto, IWorkflowJobDto } from '../../dtos';

const LOG_CONTEXT = 'WorkflowQueueService';

@Injectable()
export class WorkflowQueueService extends QueueBaseService {
  constructor(
    public workflowInMemoryProviderService: WorkflowInMemoryProviderService
  ) {
    super(
      JobTopicNameEnum.WORKFLOW,
      new BullMqService(workflowInMemoryProviderService)
    );

    Logger.log(`Creating queue ${this.topic}`, LOG_CONTEXT);

    this.createQueue();
  }

  public async add(data: IWorkflowJobDto) {
    return await super.add(data);
  }

  public async addBulk(data: IWorkflowBulkJobDto[]) {
    return await super.addBulk(data);
  }
}
