import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator.jsx';
import { pipe } from 'ramda';
import { InnerManaOceanLayer2 } from './InnerManaOceanLayer2.jsx';

const tmp = pipe(withTranslation(), withTranslator)(InnerManaOceanLayer2);

export { tmp as InnerManaOceanLayer2 };
