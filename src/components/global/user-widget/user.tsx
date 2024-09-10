"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Logout, Settings , Dashboard} from "@/icons"
import Link from "next/link"
import { DropDown } from "../drop-down"
import { handleSignOut } from "@/actions/logoutaction"

type UserWidgetProps = {
  image: string
  groupid?: string
  userid?: string
}

export const UserAvatar = ({ image, groupid, userid }: UserWidgetProps) => {

  const onLogout = async () => {
    handleSignOut()
  }

  return (
    <DropDown
      title="Account"
      trigger={
        <Avatar className="cursor-pointer">
          <AvatarImage src={image} alt="user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      }
    >
      <Link href={`/dashboard`} className="flex gap-x-2 px-2 py-1">
        <Dashboard /> Dashboard
      </Link>
      <Link href={`/group/${groupid}/settings`} className="flex gap-x-2 px-2 py-1">
        <Settings /> Settings
      </Link>
      <Button
        onClick={onLogout}
        variant="ghost"
        className="flex gap-x-3 px-2 justify-start w-full"
      >
        <Logout />
        Logout
      </Button>
    </DropDown>
  )
}
