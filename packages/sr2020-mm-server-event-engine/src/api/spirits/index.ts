import { 
  Identifiable,
  Spirit,
  SpiritFraction
} from 'sr2020-mm-event-engine';

import {
  getSpirits,
  postSpirit,
  putSpirit,
  deleteSpirit,
  getSpiritFractions,
  putSpiritFraction
} from './apiInterfaces';

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
  delete = deleteSpirit;
  get = getSpirits;
  post = postSpirit;
  put = putSpirit;
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
