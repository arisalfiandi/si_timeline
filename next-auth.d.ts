import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string; // tambahkan role di sini
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string; // extend User agar bisa punya role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role: string;
  }
}
