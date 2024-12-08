import Header from '@/components/layout/Header/header';
import FooterComponent from '@/components/layout/Footer/footer';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="public-layout">
      <Header />
      <main className="content">{children}</main>
      <FooterComponent />
    </div>
  );
};

export default PublicLayout;
