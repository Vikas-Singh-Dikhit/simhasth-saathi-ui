import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
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
import { BottomNavigation } from "./components/ui/bottom-navigation";
import Header from "./pages/Header";
import { TranslationProvider, useTranslation } from './context/TranslationContext';
import { GroupProvider } from './context/GroupContext';

const queryClient = new QueryClient();

/* ✅ Route Guard Component */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("groupEnabled") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

/* App Wrapper with translation-aware header */
const AppWrapper = () => {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/";
  const hideHeader = location.pathname === "/map";
  const { t } = useTranslation(); // Use translation context

  // Header configuration using translation keys
  const headerConfig: Record<string, { titleKey: string; subtitleKey?: string }> = {
    "/dashboard": { titleKey: "welcomeTitle" },
    "/profile": { titleKey: "profileTitle" },
    "/sos": { titleKey: "sosTitle", subtitleKey: "sosSubtitle" },
    "/helpdesk": { titleKey: "helpdeskTitle", subtitleKey: "helpdeskSubtitle" },
    "/notifications": { titleKey: "notificationsTitle" },
    "/settings": { titleKey: "settingsTitle" },
  };

  const currentHeader = headerConfig[location.pathname];

  return (
    <div className="flex flex-col h-screen">
      {!hideHeader && !hideBottomNav && currentHeader && (
        <Header
          title={t(currentHeader.titleKey)}
          subtitle={currentHeader.subtitleKey ? t(currentHeader.subtitleKey) : undefined}
          showNotifications
          onNotificationClick={() => console.log("Notifications clicked")}
        />
      )}

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto ${!hideBottomNav ? "pb-[var(--nav-height)]" : ""}`}
      >
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

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Fixed Bottom Navigation */}
      {!hideBottomNav && <BottomNavigation />}
    </div>
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
