import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { BotLayer2 } from './BotLayer2.jsx';

const tmp = pipe(withTranslation())(BotLayer2);

export { tmp as BotLayer2 };
