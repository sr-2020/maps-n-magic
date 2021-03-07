import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationLayer4 } from './LocationLayer4';
import { withLocationRecords } from '../../dataHOCs';

const tmp = pipe(withTranslation(), withLocationRecords)(LocationLayer4);

export { tmp as LocationLayer4 };
