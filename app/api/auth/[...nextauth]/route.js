import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Helper to decode JWT (to extract role from token)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", required: false },
        password: { label: "Password", type: "password", required: false },
        phone: { label: "Phone", type: "text", required: false },
        otp: { label: "OTP", type: "text", required: false },
        auth: { label: "Auth Type", type: "text", required: false }, // Just for internal check
      },
      async authorize(credentials) {
        try {
          let payload = {};
          let apiURL = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/auth`;

          if (credentials.auth === 'seller') {
            payload = {
              phone: credentials.phone,
              otp: credentials.otp,
            };
            apiURL = `${process.env.NEXT_PUBLIC_SELLER_API_URL}/user/verify-otp`;

          } else {
            // Default login (email + password)
            payload = {
              email: credentials.email,
              password: credentials.password,
            };
          }

          const res = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });


          const result = await res.json();
          console.log(result,'api response');
          if (res.ok && result.success && result.data?.token) {
            const decoded = parseJwt(result.data.token);
            // console.log(result,'result');
            return {
              id: decoded?.id || credentials.email || credentials.phone,
              email: credentials.email || null,
              phone: credentials.phone || null,
              role: decoded?.role || "user",
              token: result.data.token,
              isNewUser: result.data.isNewUser ?? false
            };            
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/unauthorized",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone ?? null,
          role: user.role,
          isNewUser: user.isNewUser ?? false,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

// ✅ ONLY export GET and POST — NOT authOptions
export const GET = handler;
export const POST = handler;
