import React from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-card">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="user-avatar" />
      ) : (
        <div className="user-avatar-initials">
          {getInitials(user.name)}
        </div>
      )}
      <div className="user-info">
        <h3 className="user-name">
          {user.name}
          {user.role === 'admin' && <span className="admin-badge">Admin</span>}
        </h3>
        <p className="user-email">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
