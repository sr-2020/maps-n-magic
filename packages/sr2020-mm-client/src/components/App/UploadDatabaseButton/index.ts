import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { UploadDatabaseButton } from './UploadDatabaseButton';

const tmp = pipe(withTranslation())(UploadDatabaseButton);

export { tmp as UploadDatabaseButton };
