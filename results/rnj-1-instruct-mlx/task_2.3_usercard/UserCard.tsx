import React from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

const UserCard = ({ name, email, avatar, role }: User) => {
  // Extract initials from name if no avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', maxWidth: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        {avatar ? (
          <img src={avatar} alt={`${name}'s avatar`} style={{ width: '48px', height: '48px', borderRadius: '50%', marginRight: '12px' }} />
        ) : (
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
            {getInitials(name)}
          </div>
        )}
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>{name}</h3>
          {role === 'admin' && <span style={{ backgroundColor: '#007bff', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Admin</span>}
          <p style={{ margin: '0', color: '#6c757d' }}>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
