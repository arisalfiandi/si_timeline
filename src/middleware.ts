// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/signin',
  },
});

export const config = {
  matcher: ['/', '/tim-kerja', '/profile', '/akun-pengguna', '/form-kegiatan'], // halaman yang butuh login
};
