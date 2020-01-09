import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { MusicSelectControl } from './MusicSelectControl.jsx';

const tmp = pipe(withTranslation())(MusicSelectControl);

export { tmp as MusicSelectControl };
