import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { withLocationRecords } from '../../dataHOCs';
import { ManaOceanLayer } from './ManaOceanLayer.jsx';

const tmp = pipe(withTranslation(), withTranslator, withLocationRecords)(ManaOceanLayer);

export { tmp as ManaOceanLayer };
