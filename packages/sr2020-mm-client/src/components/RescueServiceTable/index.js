import { pipe } from 'ramda';
import { withCharacterHealthList } from '../../dataHOCs/withCharacterHealthList.jsx';
import { RescueServiceTable } from './RescueServiceTable.jsx';

const tmp = pipe(withCharacterHealthList)(RescueServiceTable);

export { tmp as RescueServiceTable };
