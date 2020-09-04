import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { UploadDatabaseButton } from './UploadDatabaseButton.jsx';

const tmp = pipe(withTranslation())(UploadDatabaseButton);

export { tmp as UploadDatabaseButton };
