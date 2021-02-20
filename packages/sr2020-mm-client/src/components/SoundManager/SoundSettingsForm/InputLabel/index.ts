import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { InputLabel } from './InputLabel';

const tmp = pipe(withTranslation())(InputLabel);

export { tmp as InputLabel };
