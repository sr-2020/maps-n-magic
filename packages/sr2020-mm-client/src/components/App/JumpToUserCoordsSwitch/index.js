import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator';
import { pipe } from 'ramda';
import { JumpToUserCoordsSwitch } from './JumpToUserCoordsSwitch.jsx';

const tmp = pipe(withTranslation(), withTranslator)(JumpToUserCoordsSwitch);

export { tmp as JumpToUserCoordsSwitch };
