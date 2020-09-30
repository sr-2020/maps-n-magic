import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withCharacterHealthList } from '../../dataHOCs/withCharacterHealthList.jsx';
import { RescueServiceTable } from './RescueServiceTable.jsx';

const tmp = pipe(withTranslation(), withCharacterHealthList)(RescueServiceTable);

export { tmp as RescueServiceTable };
