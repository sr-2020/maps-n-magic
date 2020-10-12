import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationNeighborLayer } from './LocationNeighborLayer.jsx';
import { withTriangulationData } from '../../dataHOCs/withTriangulationData.jsx';

const tmp = pipe(withTranslation(), withTriangulationData)(LocationNeighborLayer);

export { tmp as LocationNeighborLayer };
