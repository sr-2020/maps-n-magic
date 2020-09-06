import { withMapDefaults } from 'sr2020-mm-client-core/withMapDefaults';
import { pipe } from 'ramda';
import { GeoDataStreamSimulator } from './GeoDataStreamSimulator.jsx';

const tmp = pipe(withMapDefaults)(GeoDataStreamSimulator);

export { tmp as GeoDataStreamSimulator };
