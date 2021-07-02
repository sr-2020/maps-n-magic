import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundStageEcho } from './SoundStageEcho';
import { withSoundSettings, withSoundStageState } from '../../../dataHOCs';

const tmp = pipe(withTranslation(), withSoundSettings, withSoundStageState)(SoundStageEcho);

export { tmp as SoundStageEcho };
