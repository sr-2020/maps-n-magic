import { Router } from 'express';
import * as R from 'ramda';
import { logout } from "./logout";
import { isLoggedIn } from "./isLoggedIn";
import { postUserPosition } from "./postUserPosition";

const router = Router();

router.post('/logout', logout);
router.get('/isLoggedIn', isLoggedIn);
router.post('/postUserPosition/:characterId', postUserPosition);

export const miscRouter = router;
