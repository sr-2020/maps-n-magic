import { 
  Typed,
} from '../index';

export interface PushNotificationArgs {
  characterId: number;
  title: string;
  message: string;
}

export type PushNotification = (arg: Typed<'pushNotification', PushNotificationArgs>) => void;
export type EPushNotification = Typed<'pushNotification', PushNotificationArgs>;
