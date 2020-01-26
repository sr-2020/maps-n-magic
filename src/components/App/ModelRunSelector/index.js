import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { ModelRunSelector } from './ModelRunSelector.jsx';

const tmp = pipe(withTranslation())(ModelRunSelector);

export { tmp as ModelRunSelector };
