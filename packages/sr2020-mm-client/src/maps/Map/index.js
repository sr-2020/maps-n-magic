import { withTranslation } from 'react-i18next';
import { withMapDefaults } from 'sr2020-mm-client-core/withMapDefaults';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator';
import { pipe } from 'ramda';
import { Map } from './Map.jsx';

const tmp = pipe(withTranslation(), withMapDefaults, withTranslator)(Map);

export { tmp as Map };
