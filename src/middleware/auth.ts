import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token) {
        const decoded=jwt.verify(token, 'secret') 
            if(decoded) {
                //@ts-ignore
                req.userId = decoded.id;
                //@ts-ignore
                console.log(req.userId);
                next();
            }
            else {
                res.status(401).json({
                    message: 'Invalid Credentials'
                });
                return;
            } 
        }
     else {
        res.status(401).json({
            message: 'Invalid Credentials'
        });
    }
};