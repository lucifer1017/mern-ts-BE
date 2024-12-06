import express, { Request, Response } from 'express';
import { userAuth } from '../middlewares/auth';
import { UserInterface } from '../models/userModel'; 

const profileRouter = express.Router();


declare global {
  namespace Express {
    interface Request {
      user?: UserInterface; 
    }
  }
}

profileRouter.get('/profile/view', userAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    
    const user = req.user;

    if (!user) {
       res.status(404).send("User not found");
    }

    res.send(user);

  } catch (error: any) {
    res.status(400).send("Error: " + error.message);
  }
});

export default profileRouter;