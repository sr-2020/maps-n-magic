import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { RouteInput } from './RouteInput';

const tmp = pipe(withTranslation())(RouteInput);

export { tmp as RouteInput };