import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationCentroidLayer } from './LocationCentroidLayer';
import { withTriangulationData } from '../../dataHOCs';

const tmp = pipe(withTranslation(), withTriangulationData)(LocationCentroidLayer);

export { tmp as LocationCentroidLayer };
