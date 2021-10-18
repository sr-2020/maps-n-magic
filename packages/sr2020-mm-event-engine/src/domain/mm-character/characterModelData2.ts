import { CharacterModelData } from "../ext-model-engine";
import { MessageData } from "..";
import { CatcherData } from "./spiritCatcherData";
import { SuitedState } from "../mm-spirit";

export interface CharacterModelData2 extends CharacterModelData {
  spiritSuitState: SuitedState | undefined;
  catcherData: CatcherData | undefined;
  messageData?: MessageData;
}