import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { LocationPopup3, EditableLocFields } from './LocationPopup3';

const tmp = pipe(withTranslation())(LocationPopup3);

export { tmp as LocationPopup3 };
export type { EditableLocFields };
