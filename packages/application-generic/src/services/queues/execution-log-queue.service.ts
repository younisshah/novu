import { Inject, Injectable, Logger } from '@nestjs/common';
import { JobTopicNameEnum } from '@novu/shared';

import { QueueBaseService } from './queue-base.service';
import { BullMqService } from '../bull-mq';
import { WorkflowInMemoryProviderService } from '../in-memory-provider';
import {
  IProcessSubscriberBulkJobDto,
  IProcessSubscriberJobDto,
} from '../../dtos';
import {
  IExecutionLogBulkJobDto,
  IExecutionLogJobDto,
} from '../../dtos/execution-log-job.dto';

const LOG_CONTEXT = 'ExecutionLogQueueService';

@Injectable()
export class ExecutionLogQueueService extends QueueBaseService {
  constructor(
    public workflowInMemoryProviderService: WorkflowInMemoryProviderService
  ) {
    super(
      JobTopicNameEnum.EXECUTION_LOG,
      new BullMqService(workflowInMemoryProviderService)
    );

    Logger.log(`Creating queue ${this.topic}`, LOG_CONTEXT);

    this.createQueue();
  }

  public async add(data: IExecutionLogJobDto) {
    return await super.add(data);
  }

  public async addBulk(data: IExecutionLogBulkJobDto[]) {
    return await super.addBulk(data);
  }
}
