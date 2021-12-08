import React from 'react';

export const UserProfile = ({ user }) => {
  return (
    <div className="box-center">
      <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
      <p>{user.username && <i>@{user.username}</i>}</p>
      <h1>{user.displayName || 'Anonymous User'}</h1>
    </div>
  );
};
