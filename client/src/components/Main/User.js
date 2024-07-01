import React from "react";

const User = ({ user }) => {
  return <li>{user.firstName} {user.lastName}</li>;
};

export default User;
