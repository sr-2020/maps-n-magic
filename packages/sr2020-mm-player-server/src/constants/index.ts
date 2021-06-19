import assert, { AssertionError } from "assert";

const JWT_SECRET_1 = process.env.JWT_SECRET;

if (JWT_SECRET_1 === undefined) {
  throw new AssertionError({message: "JWT_SECRET is not specified"});
  // throw new Error("JWT_SECRET is not specified");
}

export const JWT_SECRET = JWT_SECRET_1;
