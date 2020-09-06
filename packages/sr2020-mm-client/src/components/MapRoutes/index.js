import { withTranslation } from 'react-i18next';
import { withMapDefaults } from 'sr2020-mm-client-core/withMapDefaults';
import { pipe } from 'ramda';
import { MapRoutes } from './MapRoutes.jsx';

const tmp = withMapDefaults(MapRoutes);

export { tmp as MapRoutes };
