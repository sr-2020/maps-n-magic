import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withMapDefaults } from '../../withMapDefaults.jsx';
import { withTranslator } from '../../withTranslator.jsx';
import { Map } from './Map.jsx';

const tmp = pipe(withTranslation(), withMapDefaults, withTranslator)(Map);

export { tmp as Map };
