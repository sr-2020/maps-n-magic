import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core/withTranslator.jsx';
import { pipe } from 'ramda';
import { withBackgroundImages } from '../../dataHOCs/withBackgroundImages.jsx';
import { BackgroundImageLayer2 } from './BackgroundImageLayer2.jsx';

const tmp = pipe(withTranslation(), withTranslator, withBackgroundImages)(BackgroundImageLayer2);

export { tmp as BackgroundImageLayer2 };
