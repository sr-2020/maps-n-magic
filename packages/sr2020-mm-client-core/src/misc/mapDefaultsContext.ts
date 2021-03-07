import React from 'react';
import { MapDefaults } from "../types";

export const MapDefaultsContext = React.createContext<MapDefaults | null>(null);
export const MapDefaultsProvider = MapDefaultsContext.Provider;
export const MapDefaultsConsumer = MapDefaultsContext.Consumer;
