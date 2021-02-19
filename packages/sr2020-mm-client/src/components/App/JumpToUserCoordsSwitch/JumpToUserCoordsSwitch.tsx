import React, { Component } from 'react';
import './JumpToUserCoordsSwitch.css';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// import { JumpToUserCoordsSwitchPropTypes } from '../../types';

interface JumpToUserCoordsSwitchProps {
  t: any;
  waitingForGeolocation: boolean;
  translator: any;
  onClick: any;
};

export function JumpToUserCoordsSwitch(props: JumpToUserCoordsSwitchProps) {
  const {
    t, onClick, waitingForGeolocation, translator,
  } = props;
  return (
    <Dropdown.Item as="button" onClick={onClick}>
      <Form.Check
        type="switch"
        id="jumpToUserCoordsSwitch"
        label={t('jumpToUserCoords')}
        checked={translator.getVirtualCenter() !== null}
        disabled={waitingForGeolocation}
        className="tw-py-3 tw-text-lg"
        style={{ display: 'inline-block' }}
      />
      {
        waitingForGeolocation && (
          <FontAwesomeIcon
            className="tw-ml-2 tw-text-2xl tw-text-gray-700"
            icon={faSpinner}
            spin
          />
        )
      }
    </Dropdown.Item>
  );
}


// interface WithThemeProps {
//   primaryColor: string;
// }

// function withTheme<T extends WithThemeProps = WithThemeProps>(
//   WrappedComponent: React.ComponentType<T>
// ) {
//   // Try to create a nice displayName for React Dev Tools.
//   const displayName =
//     WrappedComponent.displayName || WrappedComponent.name || "Component";

//   // Creating the inner component. The calculated Props type here is the where the magic happens.
//   const ComponentWithTheme = (props: Omit<T, keyof WithThemeProps>) => {
//     // Fetch the props you want to inject. This could be done with context instead.
//     // const themeProps = useTheme();

//     // props comes afterwards so the can override the default ones.
//     return <WrappedComponent {...(props as T)} />;
//   };

//   ComponentWithTheme.displayName = `withTheme(${displayName})`;

//   return ComponentWithTheme;
// }