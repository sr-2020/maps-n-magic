import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { TimeoutInput } from './TimeoutInput.jsx';

const tmp = pipe(withTranslation())(TimeoutInput);

export { tmp as TimeoutInput };
