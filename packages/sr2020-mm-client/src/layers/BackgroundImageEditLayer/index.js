import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { withBackgroundImages } from '../../dataHOCs';
import { BackgroundImageEditLayer } from './BackgroundImageEditLayer.jsx';

const tmp = pipe(withTranslation(), withTranslator, withBackgroundImages)(BackgroundImageEditLayer);

export { tmp as BackgroundImageEditLayer };
