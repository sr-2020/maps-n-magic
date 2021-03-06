import React from 'react';
import { withTranslation } from 'react-i18next';
import { withTranslator } from 'sr2020-mm-client-core';
import { pipe } from 'ramda';
import { JumpToUserCoordsSwitch } from './JumpToUserCoordsSwitch';

// interface WithTranslatorProps {
//   translator: any;
// }

// type withTranslatorType = <T extends WithTranslatorProps = WithTranslatorProps>(WrappedComponent: React.ComponentType<T>) => {
//   (props: Omit<T, keyof WithTranslatorProps>): JSX.Element;
//   displayName: string;
// };

// function withTheme<T extends WithThemeProps = WithThemeProps>(WrappedComponent: React.ComponentType<T>): {
//   (props: Omit<T, keyof WithThemeProps>): JSX.Element;
//   displayName: string;
// }

const tmp = pipe(withTranslation(), withTranslator)(JumpToUserCoordsSwitch);

export { tmp as JumpToUserCoordsSwitch };
