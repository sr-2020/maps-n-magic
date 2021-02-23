import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withManaOceanEffectSettings } from '../../dataHOCs';
import { ManaOceanEffectSettings } from './ManaOceanEffectSettings';

const tmp = pipe(withTranslation(), withManaOceanEffectSettings)(ManaOceanEffectSettings);

export { tmp as ManaOceanEffectSettings };
