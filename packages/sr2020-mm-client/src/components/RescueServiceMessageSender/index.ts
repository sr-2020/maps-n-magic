import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { RescueServiceMessageSender } from './RescueServiceMessageSender';

const tmp = pipe(withTranslation())(RescueServiceMessageSender);

export { tmp as RescueServiceMessageSender };
