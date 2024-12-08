import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/AppLayout';

function PageStructure({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isDashboardRoute = router.pathname.startsWith('/app/');
  const Layout = isDashboardRoute ? DashboardLayout : PublicLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default PageStructure;