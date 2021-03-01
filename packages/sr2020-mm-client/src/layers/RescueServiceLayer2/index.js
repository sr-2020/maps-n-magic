import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { withCharacterHealthStatesForMap } from '../../dataHOCs/withCharacterHealthStatesForMap';
import { RescueServiceLayer2 } from './RescueServiceLayer2.jsx';

const tmp = pipe(withTranslation(), withTranslator, withCharacterHealthStatesForMap)(RescueServiceLayer2);

export { tmp as RescueServiceLayer2 };
