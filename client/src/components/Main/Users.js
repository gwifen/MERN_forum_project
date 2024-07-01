import React from "react";
import User from "./User";

const Users = ({ users }) => {
  return (
    <ul>
      {users.map((user) => <User key={user._id} user={user} />)}
    </ul>
  );
};

export default Users;
