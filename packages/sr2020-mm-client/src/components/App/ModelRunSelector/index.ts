// import { withTranslation } from 'react-i18next';
// import { pipe } from 'ramda';
import { ModelRunSelector } from './ModelRunSelector';
import { withModelRunData } from './withModelRunData';

const tmp = withModelRunData(ModelRunSelector);
// const tmp = pipe(withTranslation())(ModelRunSelector);

export { tmp as ModelRunSelector };
