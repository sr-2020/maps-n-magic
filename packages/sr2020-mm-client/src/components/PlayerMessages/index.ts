import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { PlayerMessages } from './PlayerMessages';
import { withPlayerMessages } from '../../dataHOCs';

const tmp = pipe(withTranslation(), withPlayerMessages)(PlayerMessages);

export { tmp as PlayerMessages };