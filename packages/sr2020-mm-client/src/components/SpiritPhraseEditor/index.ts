import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { SpiritPhraseEditor } from './SpiritPhraseEditor';
import { withSpiritPhrases } from '../../dataHOCs';

const tmp = pipe(withSpiritPhrases, withTranslation())(SpiritPhraseEditor);

export { tmp as SpiritPhraseEditor };