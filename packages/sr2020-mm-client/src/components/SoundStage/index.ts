import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundStage } from './SoundStage';

const tmp = pipe(withTranslation())(SoundStage);

export { tmp as SoundStage };
