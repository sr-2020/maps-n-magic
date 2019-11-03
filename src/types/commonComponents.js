
import {
  childrenPropTypes,
} from './primitives';

import { audioServicePropTypes } from './services';

export const ErrorBoundryPropTypes = {
  children: childrenPropTypes.isRequired,
};

export const MusicEditorPropTypes = {
  audioService: audioServicePropTypes.isRequired,
};
