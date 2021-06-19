import React from 'react';
// import { MapDefaults } from "../types";
import { LoginState } from "../types";

export const MapDefaultsContext = React.createContext<LoginState>({
  status: 'unknown'
});
export const MapDefaultsProvider = MapDefaultsContext.Provider;
export const MapDefaultsConsumer = MapDefaultsContext.Consumer;
