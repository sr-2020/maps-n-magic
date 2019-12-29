import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MusicSelect } from './MusicSelect.jsx';

const tmp = pipe(withTranslation())(MusicSelect);

export { tmp as MusicSelect };
