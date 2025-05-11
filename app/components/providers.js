'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { setAuthToken } from '../utils/axios';
export default function Providers({ children }) {
  return <SessionProvider>
    <AuthToken>
      {children}
    </AuthToken>
  </SessionProvider>;
}


function AuthToken({ children }) {

  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    setAuthToken(session?.accessToken);
  }
  return children;
}