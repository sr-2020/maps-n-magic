import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CreateEntityControl } from './CreateEntityControl';

const tmp = pipe(withTranslation())(CreateEntityControl);

export { tmp as CreateEntityControl };