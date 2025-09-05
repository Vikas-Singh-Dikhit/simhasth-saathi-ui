import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MapScreen from "./pages/MapScreen";
import SOSScreen from "./pages/SOSScreen";
import HelpdeskScreen from "./pages/HelpdeskScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import NotFound from "./pages/NotFound";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { IonicLayout } from "./components/layout/ionic-layout";
import { TranslationProvider } from './context/TranslationContext';
import { GroupProvider } from './context/GroupContext';


const queryClient = new QueryClient();

/* ✅ Route Guard Component */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("groupEnabled") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

/* ✅ Admin Route Guard Component */
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminAuth = localStorage.getItem("adminAuth");
  const isAdminAuthenticated = adminAuth && JSON.parse(adminAuth).isAuthenticated;
  return isAdminAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

/* App Wrapper with Ionic Layout */
const AppWrapper = () => {
  return (
    <IonicLayout>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Index />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard groupCode="GRP-2024-001" />
            </ProtectedRoute>
          }
        />
        <Route path="/map" element={<ProtectedRoute><MapScreen /></ProtectedRoute>} />
        <Route path="/sos" element={<ProtectedRoute><SOSScreen /></ProtectedRoute>} />
        <Route path="/helpdesk" element={<ProtectedRoute><HelpdeskScreen /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </IonicLayout>
  );
};

/* Main App with providers */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TranslationProvider>
        <GroupProvider>
          <BrowserRouter>
            <AppWrapper />
          </BrowserRouter>
        </GroupProvider>
        <Toaster />
      </TranslationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
