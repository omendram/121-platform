import { TranslatableString } from 'src/app/models/translatable-string.model';
import { Actor } from 'src/app/shared/actor.enum';

export class InstanceData {
  name: Actor;
  displayName: TranslatableString;
  dataPolicy: TranslatableString;
  contactDetails: TranslatableString;
  aboutProgram: TranslatableString;
}

export class InstanceInformation {
  name: Actor;
  displayName: string;
  dataPolicy: string;
  contactDetails: string;
  aboutProgram: string;
}
