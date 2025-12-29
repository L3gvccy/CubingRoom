import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ size, image = undefined }) => {
  return (
    <Avatar className={`h-${size} w-${size} rounded-full overflow-hidden`}>
      <AvatarImage
        src={image ? image : "/avatar.png"}
        alt="Аватар"
        className="object-cover w-full h-full bg-black"
      />
    </Avatar>
  );
};

export default UserAvatar;
