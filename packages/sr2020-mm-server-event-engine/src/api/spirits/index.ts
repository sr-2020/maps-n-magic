import { 
  Identifiable,
  Spirit
} from 'sr2020-mm-event-engine';

import {
  getSpirits,
  postSpirit,
  putSpirit,
  deleteSpirit,
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
