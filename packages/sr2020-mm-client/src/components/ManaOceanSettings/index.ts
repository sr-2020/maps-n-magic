import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withManaOceanSettings } from '../../dataHOCs';
import { ManaOceanSettings } from './ManaOceanSettings';

const tmp = pipe(withTranslation(), withManaOceanSettings)(ManaOceanSettings);

export { tmp as ManaOceanSettings };
