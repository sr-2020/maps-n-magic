import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MovementSimulatorSwitch } from './MovementSimulatorSwitch.jsx';

const tmp = pipe(withTranslation())(MovementSimulatorSwitch);

export { tmp as MovementSimulatorSwitch };
