import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationNeighborLayer } from './LocationNeighborLayer';
import { withTriangulationData } from '../../dataHOCs';

const tmp = pipe(withTranslation(), withTriangulationData)(LocationNeighborLayer);

export { tmp as LocationNeighborLayer };
