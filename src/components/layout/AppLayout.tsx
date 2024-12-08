// import styles from "./AppLayout.module.css";
// import AppHeaderComponent from './AppHeader/appHeader';
// import AppSidebarComponent from './AppSidebar/appSidebar';
// import AppFooterComponent from './AppFooter/appFooter';
// import { SelectedRealEstateProvider } from '@/contexts/selectedRealEstateContext';
// import { UserProvider } from '@/contexts/userContext';

// const AppLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <UserProvider>
//       <SelectedRealEstateProvider>
//         <div className={styles.appContainer}>
//           <AppHeaderComponent />
//           <div className={styles.appContent}>
//             <AppSidebarComponent />
//             <main className={styles.appMainContent}>{children}</main>
//             <AppFooterComponent />
//           </div>
//         </div>
//       </SelectedRealEstateProvider>
//     </UserProvider>
//   );
// };

// export default AppLayout;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "./AppLayout.module.css";
import AppHeaderComponent from './AppHeader/appHeader';
import AppSidebarComponent from './AppSidebar/appSidebar';
import AppFooterComponent from './AppFooter/appFooter';
import { SelectedRealEstateProvider } from '@/contexts/selectedRealEstateContext';
import { UserProvider } from '@/contexts/userContext';
import axiosInstance from '@/lib/axiosInstance';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      router.push('/auth/login/');
    } else {
      setIsAuthenticated(true);
    }

    // Füge den Response Interceptor hier hinzu
    const interceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Entferne den Token und leite zur Login-Seite weiter
          localStorage.removeItem('authToken');
          router.push('/auth/login/');
        }
        return Promise.reject(error);
      }
    );

    // Entferne den Interceptor beim Unmounten
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [router]);

  if (!isAuthenticated) {
    return <span className={styles.loader}></span>;
  }

  return (
    <UserProvider>
      <SelectedRealEstateProvider>
        <div className={styles.appContainer}>
          <AppHeaderComponent />
          <div className={styles.appContent}>
            <AppSidebarComponent />
            <main className={styles.appMainContent}>{children}</main>
            <AppFooterComponent />
          </div>
        </div>
      </SelectedRealEstateProvider>
    </UserProvider>
  );
};

export default AppLayout;
