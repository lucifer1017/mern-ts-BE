import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserInterface } from '../models/userModel'; 
const jwtsecret=process.env.JWT_SECRET;

interface DecodedToken {
    _id: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserInterface;
        }
    }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        const { token } = req.cookies;
        
      
        if (!token) {
             res.status(401).send("Please login!");
             return;
        }

        
        const decodedObj = jwt.verify(token, jwtsecret as string) as DecodedToken;
        
       
        const { _id } = decodedObj;

     
        const user = await User.findById(_id);
        
       
        if (!user) {
            throw new Error("User does not exist");
        }

        
        req.user = user;

      
        next();
    } catch (error: any) {
        res.status(400).send("ERROR: " + error.message);
        return;
    }
};

