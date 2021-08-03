import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { Emercom } from './Emercom';

const tmp = pipe(withTranslation())(Emercom);

export { tmp as Emercom };