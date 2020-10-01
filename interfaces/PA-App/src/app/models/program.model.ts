import { Fsp } from './fsp.model';
import { AnswerType } from './q-and-a.models';
import { TranslatableString } from './translatable-string.model';

export class Program {
  id: number;
  title: string | TranslatableString;
  description: string | TranslatableString;
  contactDetails?: string | TranslatableString;
  created: string;
  updated: string;
  meetingDocuments?: string | TranslatableString;
  ngo: string;
  customCriteria: ProgramCriterium[];
  financialServiceProviders: Fsp[];
  credDefId: string;
  validation: boolean;
  phoneNumberPlaceholder: string;
}

export class ProgramCriterium {
  id: number;
  criterium: string;
  answerType: AnswerType;
  label: TranslatableString;
  placeholder?: TranslatableString;
  options: null | ProgramCriteriumOption[];
}

export class ProgramCriteriumOption {
  option: string;
  label: TranslatableString;
}

export class ProgramAttribute {
  attributeId: number;
  attribute: string;
  answer: string;
}
