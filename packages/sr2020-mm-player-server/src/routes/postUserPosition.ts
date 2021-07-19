import { Router } from 'express';
import { tmpLocIndex } from 'sr2020-mm-event-engine';
import { createLogger, innerPostUserPosition, innerPostUserPosition2, PlayerAuthorizedRequest, playerServerConstants } from 'sr2020-mm-server-event-engine';
import { playerServerCookie } from '../utils/playerServerAuth';

const logger = createLogger('playerServer/postUserPosition.ts');

const router = Router();

router.post('/postUserPosition', async (req1, res, next) => {
  const req = req1 as PlayerAuthorizedRequest;
  const { modelId } = req.userData;
  const { location_id } = req.body;
  const item = tmpLocIndex.find(item => item.location_id === location_id);
  if (item === undefined) {
    res.status(404).json({});
    return;
  }

  try {
    await fetch(playerServerConstants().postUserPositionUrl, {
      method: 'POST',
      headers: {
        'Cookie': playerServerCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        characterId: req.userData.modelId,
        ssid: item.ssid
      })
    });
    res.sendStatus(200);
  } catch(err) {
    logger.error(err);
    next(err);
  }
});

export const postUserPosition = router;
