import { NextFunction, Request, Response } from "express";
import { isTokenValid } from "../utils/jwt";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import type { tokenUserI } from "../types";

const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.signedCookies.token)
    throw new UnauthenticatedError("Authentication invalid");

  try {
    const { userId, role, name } = isTokenValid(
      req.signedCookies.token
    ) as tokenUserI;
    // Attach the user and his permissions to the req object
    req.user = {
      userId,
      role,
      name,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions =
  (...allowedRoles: string[]) =>
  ({ user: { role } }: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(role))
      throw new UnauthorizedError("Access Forbiden");

    next();
  };

export { authenticateUser, authorizePermissions };
