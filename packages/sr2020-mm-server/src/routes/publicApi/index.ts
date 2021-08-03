import { Router } from 'express';
import * as R from 'ramda';
import { login } from "./login";

const router = Router();

router.post('/login', login);

export const publicApi = router;
