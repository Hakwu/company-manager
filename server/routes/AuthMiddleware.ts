import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../config";

interface DecodedToken {
    user: {
        email: string;
        password: string;
    };
}

interface AuthenticatedRequest extends Request {
    user?: DecodedToken['user'];
}

const AuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from the authorization header
        const token = (req.headers.authorization as string).split(' ')[1];

        // Check if the token matches the supposed origin
        const decodedToken = jwt.verify(token, JWT_SECRET as string) as DecodedToken;
        console.log(decodedToken)

        // Retrieve the user details of the logged-in user

        // Pass the user down to the endpoints here
        req.user = decodedToken.user;

        // Pass down functionality to the endpoint
        next();
    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request!'),
        });
    }
};

export default AuthMiddleware;
