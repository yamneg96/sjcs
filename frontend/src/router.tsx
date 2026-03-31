import { createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIFab } from "@/components/layout/AIFab";

// Lazy page imports
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import AcademicsPage from "@/pages/Academics";
import AdmissionsPage from "@/pages/Admissions";
import NewsPage from "@/pages/News";
import ClubsPage from "@/pages/Clubs";
import ContactPage from "@/pages/Contact";
import LISEntryPage from "@/pages/lis/LISEntry";
import LISIdentityPage from "@/pages/lis/LISIdentity";
import LISSecurityPage from "@/pages/lis/LISSecurity";
import LISSetupPage from "@/pages/lis/LISSetup";
import LISLoginPage from "@/pages/lis/LISLogin";
import DashboardPage from "@/pages/dashboard/Dashboard";
import AIHubPage from "@/pages/dashboard/AIHub";
import StudySessionPage from "@/pages/dashboard/StudySession";
import StudyHistoryPage from "@/pages/dashboard/StudyHistory";
import MockExamsPage from "@/pages/dashboard/MockExams";
import ExamProgressPage from "@/pages/dashboard/ExamProgress";
import ResultsPage from "@/pages/dashboard/Results";
import MaterialsPage from "@/pages/dashboard/Materials";
import ProfilePage from "@/pages/dashboard/Profile";
import SettingsPage from "@/pages/dashboard/Settings";
import PaymentsPage from "@/pages/dashboard/Payments";

// Root layout with navbar, footer, AI FAB
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <AIFab />
      <Footer />
    </>
  ),
});

// Public routes
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: "/about", component: AboutPage });
const academicsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/academics", component: AcademicsPage });
const admissionsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admissions", component: AdmissionsPage });
const newsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/news", component: NewsPage });
const clubsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/clubs", component: ClubsPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: ContactPage });

// LIS Entry routes
const lisRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lis", component: LISEntryPage });
const lisIdentityRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lis/identity", component: LISIdentityPage });
const lisSecurityRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lis/security", component: LISSecurityPage });
const lisSetupRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lis/setup", component: LISSetupPage });
const lisLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/lis/login", component: LISLoginPage });

// Dashboard routes (protected)
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard", component: DashboardPage });
const aiHubRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/ai-hub", component: AIHubPage });
const studySessionRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/study-session", component: StudySessionPage });
const studyHistoryRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/study-history", component: StudyHistoryPage });
const mockExamsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/mock-exams", component: MockExamsPage });
const examProgressRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/exam-progress", component: ExamProgressPage });
const resultsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/results", component: ResultsPage });
const materialsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/materials", component: MaterialsPage });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/profile", component: ProfilePage });
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/settings", component: SettingsPage });
const paymentsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard/payments", component: PaymentsPage });

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  academicsRoute,
  admissionsRoute,
  newsRoute,
  clubsRoute,
  contactRoute,
  lisRoute,
  lisIdentityRoute,
  lisSecurityRoute,
  lisSetupRoute,
  lisLoginRoute,
  dashboardRoute,
  aiHubRoute,
  studySessionRoute,
  studyHistoryRoute,
  mockExamsRoute,
  examProgressRoute,
  resultsRoute,
  materialsRoute,
  profileRoute,
  settingsRoute,
  paymentsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
