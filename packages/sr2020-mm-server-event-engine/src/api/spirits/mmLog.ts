import { GameModel } from "sr2020-mm-event-engine";
import { PutMainLogRecord } from "../../services/MainLogService";

export const mmLog = async function(
  gameModel: GameModel,
  type: string,
  message: string
): Promise<void> {
  gameModel.execute2<PutMainLogRecord>({
    type: 'putMainLogRecord',
    recordType: type,
    message
  });
}
