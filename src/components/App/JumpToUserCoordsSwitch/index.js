import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { JumpToUserCoordsSwitch } from './JumpToUserCoordsSwitch.jsx';

const tmp = pipe(withTranslation())(JumpToUserCoordsSwitch);

export { tmp as JumpToUserCoordsSwitch };
