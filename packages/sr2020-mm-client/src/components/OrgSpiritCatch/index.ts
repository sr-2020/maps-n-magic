import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { OrgSpiritCatch } from './OrgSpiritCatch';

const tmp = pipe(withTranslation())(OrgSpiritCatch);

export { tmp as OrgSpiritCatch };