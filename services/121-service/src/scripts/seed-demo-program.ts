import { Injectable } from '@nestjs/common';
import { InterfaceScript } from './scripts.module';
import { Connection } from 'typeorm';

import { SeedHelper } from './seed-helper';
import { SeedPublish } from './seed-publish';
import { SeedInit } from './seed-init';

import { CountryEntity } from '../programs/country/country.entity';

import fspBank from '../../examples/fsp-bravos.json';
import fspMobileMoney from '../../examples/fsp-pmesa.json';
import { ProtectionServiceProviderEntity } from '../programs/program/protection-service-provider.entity';

import programDemo from '../../examples/program-demo.json';
import { USERCONFIG } from '../secrets';
import { UserRole } from '../user-role.enum';

@Injectable()
export class SeedDemoProgram implements InterfaceScript {
  public constructor(private connection: Connection) {}

  private readonly seedHelper = new SeedHelper(this.connection);
  private readonly seedPublish = new SeedPublish();

  public async run(): Promise<void> {
    const seedInit = await new SeedInit(this.connection);
    await seedInit.run();

    await this.seedHelper.addUser({
      role: UserRole.Aidworker,
      email: USERCONFIG.emailAidWorker,
      countryId: USERCONFIG.countryId,
      password: USERCONFIG.passwordAidWorker,
    });

    await this.seedHelper.addUser({
      role: UserRole.ProjectOfficer,
      email: USERCONFIG.emailProjectOfficer,
      countryId: USERCONFIG.countryId,
      password: USERCONFIG.passwordProjectOfficer,
    });

    await this.seedHelper.addUser({
      role: UserRole.ProgramManager,
      email: USERCONFIG.emailProgramManager,
      countryId: USERCONFIG.countryId,
      password: USERCONFIG.passwordProgramManager,
    });

    // ***** CREATE COUNTRIES *****
    const countryRepository = this.connection.getRepository(CountryEntity);
    await countryRepository.save([{ country: 'Westeros' }]);

    // ***** CREATE FINANCIAL SERVICE PROVIDERS *****
    await this.seedHelper.addFsp(fspBank);
    await this.seedHelper.addFsp(fspMobileMoney);

    // ***** CREATE PROTECTION SERVICE PROVIDERS *****
    const protectionServiceProviderRepository = this.connection.getRepository(
      ProtectionServiceProviderEntity,
    );
    await protectionServiceProviderRepository.save([
      { psp: 'Protection Service Provider A' },
    ]);
    await protectionServiceProviderRepository.save([
      { psp: 'Protection Service Provider B' },
    ]);

    // ***** CREATE A INSTANCES OF THE SAME EXAMPLE PROGRAM WITH DIFFERENT TITLES FOR DIFFERENT COUNTRIES*****
    const examplePrograms = [programDemo];
    await this.seedHelper.addPrograms(examplePrograms, 1);

    // ***** ASSIGN AIDWORKER TO PROGRAM *****
    await this.seedHelper.assignAidworker(2, 1);
    await this.seedHelper.assignAidworker(2, 2);
    await this.seedHelper.assignAidworker(2, 3);

    // ***** CREATE AVAILABILITY FOR AN AIDWORKER *****
    await this.seedHelper.availabilityForAidworker(
      {
        startDate: '2020-10-10T12:00:00Z',
        endDate: '2020-10-10T13:00:00Z',
        location: 'Dorne',
      },
      2,
    );
    await this.seedHelper.availabilityForAidworker(
      {
        startDate: '2020-10-11T18:00:00Z',
        endDate: '2020-10-12T12:00:00Z',
        location: 'Casterly Rock',
      },
      2,
    );
    await this.seedHelper.availabilityForAidworker(
      {
        startDate: '2020-10-20T00:00:00Z',
        endDate: '2020-10-20T23:59:59Z',
        location: 'Highgarden',
      },
      2,
    );
  }
}

export default SeedDemoProgram;