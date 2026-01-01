import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ size, image = undefined }) => {
  const sizes = {
    xs: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-24 w-24",
    xl2: "h-32 w-32",
  };
  return (
    <Avatar className={`${sizes[size]} rounded-full overflow-hidden`}>
      <AvatarImage
        src={image ? image : "/avatar.png"}
        alt="Аватар"
        className="object-cover w-full h-full bg-zinc-100 dark:bg-zinc-900"
      />
    </Avatar>
  );
};

export default UserAvatar;
