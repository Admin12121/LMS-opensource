export const publicRoutes = [
    "/",
    "/auth/(.*)"
]

export const protectedRoutes = [
    "/settings"
]


export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/(.*)"
]


export const apiAuthPrefix = "/api/auth";
export const Default_Login_Redirect = "/settings";