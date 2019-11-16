import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { AbilitiesInput } from './AbilitiesInput.jsx';

const tmp = pipe(withTranslation())(AbilitiesInput);

export { tmp as AbilitiesInput };
