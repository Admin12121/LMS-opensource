"use client"

import { signIn } from "next-auth/react"
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import { Button } from "../ui/button"
import { Default_Login_Redirect } from "@/routes"

const Social = () => {
    const onClick = async (provider: "google" | "github") => {
        signIn(provider,{
            callbackUrl: Default_Login_Redirect
        })
    }
    return(
        <div className="flex items-center justify-center w-full gap-x-2">
            <Button size="lg" className="w-full" variant="outline" onClick={() => onClick("google")}>
                <FcGoogle size={25}/>
            </Button>
            <Button size="lg" className="w-full" variant="outline" onClick={() => onClick("github")}>
                <FaGithub size={25}/>
            </Button>
        </div>
    )
}

export default Social;