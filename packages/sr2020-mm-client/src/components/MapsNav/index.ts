import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MapsNav } from './MapsNav';

const tmp = pipe(withTranslation())(MapsNav);

export { tmp as MapsNav };
