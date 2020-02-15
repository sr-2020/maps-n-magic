import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { TrackAnalysisNav } from './TrackAnalysisNav.jsx';

const tmp = pipe(withTranslation())(TrackAnalysisNav);

export { tmp as TrackAnalysisNav };
