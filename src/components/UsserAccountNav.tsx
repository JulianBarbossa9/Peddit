"use client"

import { User } from "next-auth";
import { FC } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/DropDownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UsserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email' >
}
 
const UsserAccountNav: FC<UsserAccountNavProps> = ({ user }) => {
  return (  
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8" 
        
          user={{
            name: user.name || null,
            image: user.image || null
          }} 
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              { user.image && <p className="font-medium">{user.name}</p>}
              { user.email && <p className="w-[200px] truncate text-sm">{user.email}</p>}
            </div>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={'/'}>
              Feed
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={'/p/create'}>
              Create Community
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={'/settings'}>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            })
          }} className="cursor-pointer">
            Sign Out
          </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
 
export default UsserAccountNav;