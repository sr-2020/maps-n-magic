import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundSettingsForm } from './SoundSettingsForm';

const tmp = pipe(withTranslation())(SoundSettingsForm);

export { tmp as SoundSettingsForm };
