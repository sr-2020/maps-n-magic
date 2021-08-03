import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MovementSimulatorSwitch } from './MovementSimulatorSwitch';

const tmp = pipe(withTranslation())(MovementSimulatorSwitch);

export { tmp as MovementSimulatorSwitch };
