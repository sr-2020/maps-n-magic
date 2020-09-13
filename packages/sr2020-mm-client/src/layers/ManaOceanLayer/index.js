import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { ManaOceanLayer } from './ManaOceanLayer.jsx';

const tmp = pipe(withTranslation())(ManaOceanLayer);

export { tmp as ManaOceanLayer };
