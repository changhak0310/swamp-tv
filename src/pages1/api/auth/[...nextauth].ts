import NextAuth from 'next-auth';
import NaverProvider from 'next-auth/providers/naver';

export default NextAuth({
  providers: [
    NaverProvider({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || '',
      scope: 'name profile email',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    // redirect 콜백 추가
    async redirect({ url, baseUrl }) {
      // 로그인 성공 후 이동할 페이지
      return `${baseUrl}/test`; // /dashboard 페이지로 이동
    },
  },
});
