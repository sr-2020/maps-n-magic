import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BeaconRecordEditor } from './BeaconRecordEditor.jsx';

const tmp = pipe(withTranslation())(BeaconRecordEditor);

export { tmp as BeaconRecordEditor };
