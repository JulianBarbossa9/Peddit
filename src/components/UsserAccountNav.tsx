import { User } from "next-auth";
import { FC } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/DropDownMenu";
import UserAvatar from "./UserAvatar";

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
    </DropdownMenu>
  );
}
 
export default UsserAccountNav;