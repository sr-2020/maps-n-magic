import { 
  Identifiable,
  Spirit,
  SpiritFraction,
  SpiritRoute,
} from 'sr2020-mm-event-engine';

import {
  getSpirits,
  postSpirit,
  putSpirit,
  deleteSpirit,
} from './spirits';

import {
  getSpiritFractions,
  putSpiritFraction
} from './spiritFractions';

import { 
  getSpiritRoutes, 
  postSpiritRoute, 
  putSpiritRoute, 
  deleteSpiritRoute 
} from "./spiritRoutes";

import {  
  Gettable2,
  Postable2,
  Puttable2,
  Deletable2,
  // MultiPuttable
} from "../types";

export class SpiritProvider implements 
  Gettable2<Spirit>, 
  Postable2<Spirit>, 
  Puttable2<Spirit>, 
  Deletable2<Spirit>
{
  get = getSpirits;
  post = postSpirit;
  put = putSpirit;
  delete = deleteSpirit;
}
export class SpiritFractionProvider implements 
  Gettable2<SpiritFraction>, 
  Postable2<SpiritFraction>, 
  Puttable2<SpiritFraction>, 
  Deletable2<SpiritFraction>
{
  get = getSpiritFractions;
  put = putSpiritFraction;
  post(entity: Partial<Omit<SpiritFraction, 'id'>>): Promise<SpiritFraction> {
    throw new Error('Method post SpiritFraction not implemented.');
  }
  delete(id: number): Promise<SpiritFraction | null> {
    throw new Error('Method delete SpiritFraction not implemented.');
  }
}

export class SpiritRouteProvider implements 
  Gettable2<SpiritRoute>, 
  Postable2<SpiritRoute>, 
  Puttable2<SpiritRoute>, 
  Deletable2<SpiritRoute>
{
  get = getSpiritRoutes;
  post = postSpiritRoute;
  put = putSpiritRoute;
  delete = deleteSpiritRoute;
}
