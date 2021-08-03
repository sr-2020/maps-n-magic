import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { withLocationRecords, withGeoLocationRecords } from '../../dataHOCs';
import { ManaOceanLayer } from './ManaOceanLayer';

const tmp = pipe(
  withTranslation(), 
  withTranslator, 
  withGeoLocationRecords,
  withLocationRecords,
)(ManaOceanLayer);

export { tmp as ManaOceanLayer };
