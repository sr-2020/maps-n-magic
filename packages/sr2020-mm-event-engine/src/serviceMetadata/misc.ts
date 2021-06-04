import { 
  Typed,
} from '../index';

export interface PushNotificationArgs {
  characterId: number;
  title: string;
  message: string;
}

export type PushNotification = Typed<'pushNotification', PushNotificationArgs>;
export type EPushNotification = Typed<'pushNotification', PushNotificationArgs>;
