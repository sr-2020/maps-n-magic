import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationCentroidLayer } from './LocationCentroidLayer.jsx';
import { withTriangulationData } from '../../dataHOCs/withTriangulationData';

const tmp = pipe(withTranslation(), withTriangulationData)(LocationCentroidLayer);

export { tmp as LocationCentroidLayer };
