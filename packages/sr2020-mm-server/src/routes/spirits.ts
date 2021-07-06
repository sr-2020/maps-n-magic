import { Router } from 'express';

const router = Router();

router.post('/catchSpirit', (req, res, next) => {
  const { body } = req;

  res.status(200).json(body);
});

export const spiritRouter = router;
