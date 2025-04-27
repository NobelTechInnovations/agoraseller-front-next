import Sidebar from './sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[220px] flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
} 