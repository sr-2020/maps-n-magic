import * as jwt from "jsonwebtoken";
import { playerServerConstants } from "sr2020-mm-server-event-engine";

export const playerServerToken = jwt.sign(
  playerServerConstants().playerServerTokenPayload, 
  playerServerConstants().JWT_SECRET
);

export const playerServerCookie = 'mm_token=' + playerServerToken;