import { withTranslation } from 'react-i18next';
import { pipe } from 'ramda';
import { TideChart } from './TideChart';

const tmp = pipe(withTranslation())(TideChart);

export { tmp as TideChart };
