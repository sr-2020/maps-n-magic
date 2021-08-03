import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { CharacterLocationLayer } from './CharacterLocationLayer';
import { withLocationRecords } from '../../dataHOCs';
import { withCharacterPosition } from '../../dataHOCs';

const tmp = pipe(withTranslation(), withCharacterPosition, withLocationRecords)(CharacterLocationLayer);

export { tmp as CharacterLocationLayer };
