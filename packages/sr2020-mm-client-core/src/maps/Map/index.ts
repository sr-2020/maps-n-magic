import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withMapDefaults } from '../../misc/withMapDefaults';
import { withTranslator } from '../../misc/withTranslator';
import { Map } from './Map';

const tmp = pipe(withTranslation(), withMapDefaults, withTranslator)(Map);

export { tmp as Map };
