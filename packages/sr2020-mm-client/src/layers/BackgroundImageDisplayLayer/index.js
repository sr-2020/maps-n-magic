import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { withBackgroundImages } from '../../dataHOCs';
import { BackgroundImageDisplayLayer } from './BackgroundImageDisplayLayer.jsx';

const tmp = pipe(withTranslation(), withTranslator, withBackgroundImages)(BackgroundImageDisplayLayer);

export { tmp as BackgroundImageDisplayLayer };
