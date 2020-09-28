import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator.jsx';
import { pipe } from 'ramda';
import { withCharacterHealthStates } from '../../dataHOCs/withCharacterHealthStates.jsx';
import { RescueServiceLayer2 } from './RescueServiceLayer2.jsx';

const tmp = pipe(withTranslation(), withTranslator, withCharacterHealthStates)(RescueServiceLayer2);

export { tmp as RescueServiceLayer2 };
