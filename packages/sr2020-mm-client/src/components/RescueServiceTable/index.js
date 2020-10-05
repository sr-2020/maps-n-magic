import { pipe } from 'ramda';
import { withCharacterHealthListForTable } from '../../dataHOCs/withCharacterHealthListForTable.jsx';
import { RescueServiceTable } from './RescueServiceTable.jsx';

const tmp = pipe(withCharacterHealthListForTable)(RescueServiceTable);

export { tmp as RescueServiceTable };
