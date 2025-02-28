import React from 'react';
import { useGetUser } from '../hooks/useGetUser';

export default function Home() {
  const { userInfo, loading } = useGetUser();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Info</h1>

      {loading ? (
        <p>Loading user info...</p>
      ) : userInfo ? (
        <div>
          <h2 className="text-xl font-bold">Welcome, {userInfo.nickname}!</h2>
          <img
            src={userInfo.profileImageUrl || '/default-avatar.png'}
            alt={userInfo.nickname || 'User'}
            className="w-20 h-20 rounded-full"
          />
          {/* Display other userInfo fields as needed */}
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
