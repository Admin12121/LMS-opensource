import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"}),
});


export const RegisterSchema = z.object({
    username: z.string().min(3,{message:"Name must be at least 3 characters long"}),
    email: z.string().email({message:"Email is required"}),
    password: z.string().min(6,{message:"Password must be at least 6 characters long"}),
});

