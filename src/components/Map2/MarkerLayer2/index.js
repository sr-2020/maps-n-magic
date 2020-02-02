import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MarkerLayer2 } from './MarkerLayer2.jsx';

const tmp = pipe(withTranslation())(MarkerLayer2);

export { tmp as MarkerLayer2 };
