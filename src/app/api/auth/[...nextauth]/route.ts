// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// // app/api/auth/[...nextauth]/route.ts
// 'use server';
// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// // import { createClient } from '@supabase/supabase-js';
// // import { createClient } from '@/lib/supabase/server';
// import { supabaseServer as supabase } from '@/lib/supabase/server';

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.SUPABASE_SERVICE_ROLE_KEY!, // penting: pakai service role key
// // );

// interface GoogleProfile {
//   email: string;
//   name: string;
//   picture: string;
// }

// const handler = NextAuth({
//   providers: [
//     // 1. Google Login
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope:
//             'openid email profile https://www.googleapis.com/auth/calendar',
//           access_type: 'offline',
//           prompt: 'consent',
//         },
//       },
//     }),

//     // 2. Local Login
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         console.log('credentials:', credentials);

//         const { data: user, error } = await supabase
//           .from('User')
//           .select('*')
//           .eq('email', credentials?.email)
//           .eq('provider', 'local')
//           .single();

//         console.log('user:', user, 'error:', error);
//         if (!user) return null;

//         console.log(user);

//         const isValid = await bcrypt.compare(
//           credentials!.password,
//           user.password_hash,
//         );
//         return isValid ? user : null;
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt', // biar pakai JWT, bukan database
//     maxAge: 7 * 24 * 60 * 60, // 7 hari dalam detik
//   },
//   callbacks: {
//     async signIn({ account, profile }) {
//       if (account?.provider === 'google') {
//         const { access_token, refresh_token, expires_at } = account;
//         const { email, name, picture } = profile as GoogleProfile;
//         // const supabase = await createClient();

//         const { data, error } = await supabase.from('User').upsert(
//           {
//             email,
//             name,
//             picture,
//             provider: 'google',
//             google_access_token: access_token,
//             google_refresh_token: refresh_token,
//             token_expiry: new Date(Date.now() + (expires_at ?? 3600) * 1000),
//             nomor_hp: '082xxxxxxxx',
//             role: 'pegawai',
//           },
//           { onConflict: 'email' },
//         );

//         console.log('Upsert result:', data);
//         console.log('Upsert error:', error);
//       }
//       return true;
//     },
//     async session({ session, token }) {
//       // tambahkan data user ke session
//       if (token.email) {
//         const { data: user } = await supabase
//           .from('User')
//           .select('*')
//           .eq('email', token.email)
//           .single();
//         session.user = user;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) token.email = user.email;
//       return token;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
