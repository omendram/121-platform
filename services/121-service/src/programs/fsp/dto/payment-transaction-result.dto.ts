import { StatusEnum } from 'src/shared/enum/status.enum';

import { fspName } from '../financial-service-provider.entity';

export class PaymentTransactionResultDto {
  public nrFailed: number;
  public nrWaiting: number;
  public nrSuccessfull: number;
}

export class FspTransactionResultDto {
  public fspName: fspName;
  public status: StatusEnum;
  public message: any;
  public paList: PaTransactionResultDto[];
}

export class PaTransactionResultDto {
  public did: string;
  public status: StatusEnum;
  public message: string;
}
