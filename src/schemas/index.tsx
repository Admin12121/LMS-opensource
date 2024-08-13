import * as z from "zod";



export const OtpSchema = z.object({
    otp: z.string().min(4,{message:"OTP must be at least 4 characters long"}),
    uid: z.string().min(1,{message:"UID is required"}),
});



export const PasswordSchema = z.object({
    uid: z.string().min(1,{message:"UID is required"}),
    token: z.string().min(1,{message:"Token is required"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"}),
});


export const ResetPasswordSchema = z.object({
    email: z.string().email(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {message:"Password is required"}),
});


export const RegisterSchema = z.object({
    username: z.string().min(3,{message:"Name must be at least 3 characters long"}),
    email: z.string().email({message:"Email is required"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"}),
});

