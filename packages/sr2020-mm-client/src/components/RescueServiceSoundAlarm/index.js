import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { withCharacterIdHealthList } from '../../dataHOCs/withCharacterIdHealthList.jsx';
import { RescueServiceSoundAlarm } from './RescueServiceSoundAlarm.jsx';

const tmp = pipe(withTranslation(), withCharacterIdHealthList)(RescueServiceSoundAlarm);

export { tmp as RescueServiceSoundAlarm };
