import { Timestamp } from 'firebase/firestore';

export interface Account {
  id: string;
  created_at: Timestamp;
  first_name: string;
  last_name: string;
  gender: AccGender;
  status: AccStatus;
  phone: string;
}

export interface InProgressAccount extends Pick<Account, 'id' | 'created_at'> {
  status: AccStatus.InProgress;
}

export enum AccGender {
  Male = 'male',
  Female = 'female',
}

export enum AccStatus {
  InProgress = 'in-progress',
  NotActive = 'not-active',
  ActivationPending = 'on-confirmation',
  Active = 'success',
  Error = 'error',
}

export enum AccCreationDrawerTabs {
  RegistrationMethods,
  MainSettings,
  ProxyAndStreams,
}

export enum FarmDrawerTabs {
  MainSettings,
  StartOfFarm,
  FanPage,
  Farm,
  AdsTool
}

