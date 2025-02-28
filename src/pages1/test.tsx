import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useGetUser } from '@/hooks/useGetUser';

export default function Home() {
  const { data: session, status } = useSession();

  const { userInfo, loading} = useGetUser();

  return (
    <div>
      {status === 'authenticated' ? (
        <div>
          <p>로그인됨: {session?.user?.name}</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그인되지 않음</p>
          <button onClick={() => signIn('naver')}>네이버로 로그인</button>
        </div>
      )}
      {userInfo}
    </div>
  );
}
