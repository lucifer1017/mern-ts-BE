import validator from 'validator';


interface UserSignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export const validateUserSignup = (data: UserSignupData): void => { 
    const { firstName, lastName, email, password } = data;
    
    
    if (!firstName || !lastName) {
        throw new Error("Invalid Name");
    }
    
   
    if (!validator.isEmail(email)) {
        throw new Error("Invalid Email");
    }
    
    
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password entered is not Strong");
    }
};