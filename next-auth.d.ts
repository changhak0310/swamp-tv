import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      profileImageUrl?: string;
      nickname?: string;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken?: string;
    profileImageUrl?: string;
    nickname?: string;
  }
}
