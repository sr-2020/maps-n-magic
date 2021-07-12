import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { AbilitiesInput2 } from './AbilitiesInput2';
import { withFeatures, withSpiritFeatures } from '../../../../dataHOCs';

const tmp = pipe(
  withTranslation(), 
  withSpiritFeatures, 
  withFeatures
)(AbilitiesInput2);

export { tmp as AbilitiesInput2 };