import { pipe } from 'ramda';
import { withCharacterHealthListForTable } from '../../dataHOCs';
import { RescueServiceTable } from './RescueServiceTable';

const tmp = pipe(withCharacterHealthListForTable)(RescueServiceTable);

export { tmp as RescueServiceTable };
