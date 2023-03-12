import {NextFunction, Request, RequestHandler, Response} from "express";
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {getAuth} from "firebase-admin/auth";
import setup from "./setup.js";

setup();

const auth = getAuth();


export type AuthenticatedRequest = Request & { user: DecodedIdToken };

/**
 * Middleware to authenticate a request
 * @param {AuthenticatedRequest} req request
 * @param {Response} res response
 * @param {NextFunction} next next function
 */
const authenticate: RequestHandler = async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authKey = req.headers["x-auth-key"] || req.query["token"];
    if (typeof authKey !== "string") {
        res.status(401).send("error");
        return;
    }
    req.user = await auth.verifyIdToken(authKey);
    next();
} as unknown as RequestHandler;

export default authenticate;
