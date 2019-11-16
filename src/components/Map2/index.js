import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { Map2 } from './Map2.jsx';

const tmp = pipe(withTranslation())(Map2);

export { tmp as Map2 };
