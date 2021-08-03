import { Router } from 'express';
import * as R from 'ramda';
import { putSpiritInJar } from "./putSpiritInJar";

const router = Router();

router.post('/putSpiritInJar', putSpiritInJar);

export const innerApi2 = router;
