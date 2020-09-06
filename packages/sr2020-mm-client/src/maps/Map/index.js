import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { Map } from './Map.jsx';

const tmp = pipe(withTranslation())(Map);

export { tmp as Map };
