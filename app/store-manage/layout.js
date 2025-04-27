import DashboardLayout from '../components/layout/DashboardLayout';

export const metadata = {
  title: 'Seller Dashboard | Agora',
  description: 'Manage your Agora seller account',
};

export default function StoreManageLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 