import assert, { AssertionError } from "assert";

const JWT_SECRET_1 = process.env.JWT_SECRET;
const MM_MASTER_SERVER_URL_1 = process.env.MM_MASTER_SERVER_URL;

if (JWT_SECRET_1 === undefined) {
  throw new AssertionError({message: "JWT_SECRET is not specified"});
}
if (MM_MASTER_SERVER_URL_1 === undefined) {
  throw new AssertionError({message: "MM_MASTER_SERVER_URL_1 is not specified"});
}

export const JWT_SECRET = JWT_SECRET_1;
export const MM_MASTER_SERVER_URL = MM_MASTER_SERVER_URL_1;
