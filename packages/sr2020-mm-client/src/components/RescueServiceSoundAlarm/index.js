import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withCharacterIdHealthListForAudio } from '../../dataHOCs/withCharacterIdHealthListForAudio';
import { RescueServiceSoundAlarm } from './RescueServiceSoundAlarm.jsx';

const tmp = pipe(withTranslation(), withCharacterIdHealthListForAudio)(RescueServiceSoundAlarm);

export { tmp as RescueServiceSoundAlarm };
