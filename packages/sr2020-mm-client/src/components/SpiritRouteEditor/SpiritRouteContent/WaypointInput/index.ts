import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { WaypointInput } from './WaypointInput';
import { withLocationRecords } from '../../../../dataHOCs';

const tmp = pipe(withLocationRecords, withTranslation())(WaypointInput);

export { tmp as WaypointInput };
