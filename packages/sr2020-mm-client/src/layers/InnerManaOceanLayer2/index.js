import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator.jsx';
import { pipe } from 'ramda';
import { withLocationRecords } from '../../dataHOCs/withLocationRecords.jsx';
import { InnerManaOceanLayer2 } from './InnerManaOceanLayer2.jsx';

const tmp = pipe(withTranslation(), withTranslator, withLocationRecords)(InnerManaOceanLayer2);

export { tmp as InnerManaOceanLayer2 };
