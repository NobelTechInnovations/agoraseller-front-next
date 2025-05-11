import DashboardLayout from '../components/layout/DashboardLayout';
import Providers from '../components/providers';
export const metadata = {
  title: 'Seller Dashboard | Agora',
  description: 'Manage your Agora seller account',
};

export default function StoreManageLayout({ children }) {

  return <DashboardLayout>
    <Providers>
      {children}
    </Providers>
  </DashboardLayout>;
} 