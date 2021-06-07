import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritMovementSwitch } from './SpiritMovementSwitch';
import { withEnableSpiritMovement } from '../../../dataHOCs';

const tmp = pipe(withTranslation(), withEnableSpiritMovement)(SpiritMovementSwitch);

export { tmp as SpiritMovementSwitch };
