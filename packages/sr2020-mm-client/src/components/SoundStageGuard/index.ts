import { pipe } from 'ramda';
import { SoundStageGuard } from './SoundStageGuard';
import { withSoundSettings, withSoundStageState } from "../../dataHOCs";

const tmp = pipe(withSoundSettings, withSoundStageState)(SoundStageGuard);

export { tmp as SoundStageGuard };