import Image from "next/image";

import { User } from "@/state/api";

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="mb-3 flex items-center rounded border p-4 shadow">
      {user.profilePictureUrl && (
        <Image
          src={`/${user.profilePictureUrl}`}
          alt={user.username}
          className="size-10 rounded-full object-cover"
          width={32}
          height={32}
        />
      )}
      <div className="ml-4">
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export { UserCard };
