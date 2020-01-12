import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { DownloadDatabaseButton } from './DownloadDatabaseButton.jsx';

const tmp = pipe(withTranslation())(DownloadDatabaseButton);

export { tmp as DownloadDatabaseButton };
