import { Router } from 'express';
import { createLogger } from 'sr2020-mm-server-event-engine';
import { PlayerAuthorizedRequest } from '../types';

const logger = createLogger('refreshCharacterModel.ts');

const router = Router();

router.post('/refreshCharacterModel', async (req1, res) => {
  const req = req1 as PlayerAuthorizedRequest;
  
  await req.characterWatcher.forceUpdateCharacterModel(
    Number(req.characterModelData.workModel.modelId)
  );

  res.status(200).json({});
});

export const refreshCharacterModelRouter = router;
