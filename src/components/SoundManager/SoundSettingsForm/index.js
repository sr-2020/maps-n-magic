import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SoundSettingsForm } from './SoundSettingsForm.jsx';

const tmp = pipe(withTranslation())(SoundSettingsForm);

export { tmp as SoundSettingsForm };
