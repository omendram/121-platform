import { CreateConnectionService } from './../sovrin/create-connection/create-connection.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionEntity } from '../sovrin/create-connection/connection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronjobService {
  @InjectRepository(ConnectionEntity)
  private readonly connectionRepository: Repository<ConnectionEntity>;
  public constructor(
    private readonly connectionService: CreateConnectionService,
  ) {}

  // Use CronExpression.EVERY_10_SECONDS for testing instead of: CronExpression.EVERY_DAY_AT_MIDNIGHT or:
  // @Cron(CronExpression.EVERY_DAY_AT_NOON)
  @Cron(new Date(Date.now() - 1000)) // To disable running the task, set to run it in the past
  async cronDeleteOldUnfinishedConnections(): Promise<void> {
    console.log('Get old unfinished connections');
    const tsYesterday = Math.round(new Date().getTime()) - 24 * 60 * 60 * 1000;
    // const tsYesterday = Math.round(new Date().getTime()); // Use this line to test just created connections, instead of 24h old;

    const unfinishedConnections = await this.connectionRepository.find({
      where: { appliedDate: null },
    });
    const oldUnfinishedConnections = unfinishedConnections.filter(i => {
      const tsCreated = Math.round(new Date(i.created).getTime());
      return tsCreated < tsYesterday;
    });

    oldUnfinishedConnections.forEach(connection => {
      this.connectionService.deleteRegistration(connection.did);
    });
  }
}
