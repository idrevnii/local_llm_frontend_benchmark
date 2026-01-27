import React from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

const UserCard: React.FC<User> = ({ name, email, avatar, role }) => {
  // Generate initials from name (split by space and take first letter of each part)
  const initials = name.split(' ').map(part => part[0]).join('');

  // Determine badge text based on role
  const badgeText = role === 'admin' ? 'Admin' : '';

  return (
    <div style={{ border: '1px solid #ddd', padding: '16px', margin: '8px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      {avatar ? (
        <img src={avatar} alt={`${name}'s avatar`} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '16px' }} />
      ) : (
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 8px 0 0' }}>
          {initials}
        </span>
      )}
      
      <div>
        <h3 style={{ margin: '0 0 4px 0' }}>{name}</h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>{email}</p>
        
        {badgeText && (
          <span style={{
            backgroundColor: role === 'admin' ? '#007bff' : '#e9ecef',
            color: role === 'admin' ? '#fff' : '#333',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginLeft: '8px'
          }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserCard;
