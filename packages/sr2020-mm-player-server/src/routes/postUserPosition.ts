import { Router } from 'express';
import { createLogger, innerPostUserPosition } from 'sr2020-mm-server-event-engine';

const logger = createLogger('postUserPosition.ts');

const router = Router();

router.post('/postUserPosition/:characterId', (req, res, next) => {
  const beacon = req.body;
  innerPostUserPosition(Number(req.params.characterId), beacon).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    logger.error(err);
    next(err);
  });
});

export const postUserPosition = router;
