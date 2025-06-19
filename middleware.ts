import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'], // allow public homepage
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'], // protect all routes except public
};
