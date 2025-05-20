import DashboardLayout from '../components/layout/DashboardLayout';
import Providers from '../components/providers';
export const metadata = {
  title: 'Seller Dashboard | Geniezy',
  description: 'Manage your Geniezy seller account',
};

export default function StoreManageLayout({ children }) {

  return <DashboardLayout>
    <Providers>
      {children}
    </Providers>
  </DashboardLayout>;
} 