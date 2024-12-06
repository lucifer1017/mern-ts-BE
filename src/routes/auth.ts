import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { validateUserSignup } from '../utils/validating';


interface SignupRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const authRouter = express.Router();


authRouter.post('/signup', async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {
    const data = req.body;

    try {
        
        validateUserSignup(data);

      
        const passwordHash = await bcrypt.hash(data.password, 10);
        data.password = passwordHash;

      
        const user = new User(data);

       
        const savedUser = await user.save();
        if (!savedUser) {
            throw new Error("Cannot save user");
        }

     
        const token = savedUser.getJWT();

  
        res.cookie("token", token, {
            maxAge: 8 * 72000000 
        });

        res.json({ message: "User added successfully", data: savedUser });
    } catch (error: unknown) {
        if (error instanceof Error) { 
            res.status(400).send("Error: " + error.message);
        } else {
            res.status(400).send("Unknown error occurred.");
        }
    }
});


authRouter.post('/login', async (req: Request<{}, {}, { email: string, password: string }>, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

       
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw new Error("Invalid Credentials");
        }

       
        const token = user.getJWT();

       
        res.cookie("token", token, {
            maxAge: 8 * 72000000 
        });

      
        res.json({message:"Logged in Successfully!",data:user});
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send("Error: " + error.message);
        } else {
            res.status(400).send("Unknown error occurred.");
        }
    }
});


authRouter.post('/logout', async (req: Request, res: Response) => {
    
    res.cookie("token", null, {
        maxAge: 0
    });

    res.json({message:"Logged out successfully"});
});

export default authRouter;