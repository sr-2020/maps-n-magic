import { 
  Metadata, 
  Typed,
  TypeOnly,
} from '../../core';

import { 
  SpiritRoute
} from "../../types";

export const spiritRouteMetadata: Metadata = {
  requests: ['spiritRoutes', 'spiritRoute'],
  actions: [],
  emitEvents: [
    'postSpiritRoute',
    'postSpiritRouteRequested',
    'putSpiritRoute',
    'deleteSpiritRoute',
    'spiritRoutesChanged',
  ],
  listenEvents: [
    'postSpiritRouteConfirmed',
    'putSpiritRouteConfirmed',
    'deleteSpiritRouteConfirmed',
    'setSpiritRoutes',
    'cloneSpiritRouteRequested'
  ],
  needActions: [],
  needRequests: [],
};

// requests

export type GetSpiritRoutes = (arg: TypeOnly<'spiritRoutes'>) => SpiritRoute[];
export type GetSpiritRoute = (arg: Typed<'spiritRoute', {id: number}>) => SpiritRoute | undefined;

// emit events

export type SingleSpiritRoute = {
  spiritRoute: SpiritRoute;
};
export type PostSpiritRouteArgs = {
  props: Partial<Omit<SpiritRoute, 'id'>>
};
export type PutSpiritRouteArgs = {
  id: number;
  props: Partial<Omit<SpiritRoute, 'id'>>;
};
export type DeleteSpiritRouteArgs = {
  id: number;
};

export type SpiritRouteList = {
  spiritRoutes: SpiritRoute[]
};

export type EPostSpiritRouteRequested = Typed<'postSpiritRouteRequested', PostSpiritRouteArgs>;
export type EPostSpiritRoute = Typed<'postSpiritRoute', SingleSpiritRoute>;
export type EPutSpiritRouteRequested = Typed<'putSpiritRouteRequested', PutSpiritRouteArgs>;
export type EPutSpiritRoute = Typed<'putSpiritRoute', SingleSpiritRoute>;
export type EDeleteSpiritRouteRequested = Typed<'deleteSpiritRouteRequested', DeleteSpiritRouteArgs>;
export type EDeleteSpiritRoute = Typed<'deleteSpiritRoute', SingleSpiritRoute>;
export type ESpiritRoutesChanged = Typed<'spiritRoutesChanged', SpiritRouteList>;

export type SpiritRouteEmitEvents = 
  EPostSpiritRoute |
  EPutSpiritRoute |
  EDeleteSpiritRoute |
  ESpiritRoutesChanged |
  EPostSpiritRouteRequested
;

// listen events

export type EPostSpiritRouteConfirmed = Typed<'postSpiritRouteConfirmed', SingleSpiritRoute>;
export type EPutSpiritRouteConfirmed = Typed<'putSpiritRouteConfirmed', SingleSpiritRoute>;
export type EDeleteSpiritRouteConfirmed = Typed<'deleteSpiritRouteConfirmed', SingleSpiritRoute>;
export type ESetSpiritRoutes = Typed<'setSpiritRoutes', SpiritRouteList>;
export type ECloneSpiritRouteRequested = Typed<'cloneSpiritRouteRequested', {
  id: number;
}>;

export type SpiritRouteListenEvents = 
  EPostSpiritRouteConfirmed |
  EPutSpiritRouteConfirmed |
  EDeleteSpiritRouteConfirmed |
  ESetSpiritRoutes |
  ECloneSpiritRouteRequested
;