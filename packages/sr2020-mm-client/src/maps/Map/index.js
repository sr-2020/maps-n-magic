import { withTranslation } from 'react-i18next';
import { withMapDefaults } from 'sr2020-mm-client-core/withMapDefaults';
import { pipe } from 'ramda';
import { Map } from './Map.jsx';

const tmp = pipe(withTranslation(), withMapDefaults)(Map);

export { tmp as Map };
