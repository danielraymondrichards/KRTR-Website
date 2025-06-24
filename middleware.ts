import { authMiddleware } from '@supabase/auth-helpers-nextjs';

export const config = {
  matcher: ['/cms/:path*'], // protects all /cms routes
};

export default authMiddleware({
  redirectTo: '/cms/sign-in', // redirect unauthenticated users
});

