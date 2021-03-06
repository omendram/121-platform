import { Injectable, HttpStatus } from '@nestjs/common';
import { twilioClient } from '../twilio.client';

@Injectable()
export class LookupService {
  public constructor() {}

  public async lookupPhoneNr(phoneNumber: string): Promise<any> {
    let numberCorrect: boolean;
    try {
      await twilioClient.lookups
        .phoneNumbers(phoneNumber)
        .fetch({ type: ['carrier'] });
      numberCorrect = true;
    } catch (e) {
      if (e.status === HttpStatus.NOT_FOUND) {
        numberCorrect = false;
      }
    }
    return { result: numberCorrect };
  }
}
