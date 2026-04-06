import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIFab } from "@/components/layout/AIFab";
import ProtectedRoute from "./lib/protectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

import React, { lazy, Suspense } from "react";

/* =========================
   Lazy Loaded Pages
========================= */

// Public pages
const HomePage = lazy(() => import("@/pages/Home"));
const AboutPage = lazy(() => import("@/pages/About"));
const AcademicsPage = lazy(() => import("@/pages/Academics"));
const AdmissionsPage = lazy(() => import("@/pages/Admissions"));
const NewsPage = lazy(() => import("@/pages/News"));
const ClubsPage = lazy(() => import("@/pages/Clubs"));
const ContactPage = lazy(() => import("@/pages/Contact"));

// LIS pages
const LISEntryPage = lazy(() => import("@/pages/lis/LISEntry"));
const LISIdentityPage = lazy(() => import("@/pages/lis/LISIdentity"));
const LISSecurityPage = lazy(() => import("@/pages/lis/LISSecurity"));
const LISSetupPage = lazy(() => import("@/pages/lis/LISSetup"));
const LISLoginPage = lazy(() => import("@/pages/lis/LISLogin"));

// Dashboard pages
const DashboardPage = lazy(() => import("@/pages/dashboard/Dashboard"));
const AIHubPage = lazy(() => import("@/pages/dashboard/AIHub"));
const StudySessionPage = lazy(() => import("@/pages/dashboard/StudySession"));
const StudyHistoryPage = lazy(() => import("@/pages/dashboard/StudyHistory"));
const MockExamsPage = lazy(() => import("@/pages/dashboard/MockExams"));
const ExamProgressPage = lazy(() => import("@/pages/dashboard/ExamProgress"));
const ResultsPage = lazy(() => import("@/pages/dashboard/Results"));
const MaterialsPage = lazy(() => import("@/pages/dashboard/Materials"));
const ProfilePage = lazy(() => import("@/pages/dashboard/Profile"));
const SettingsPage = lazy(() => import("@/pages/dashboard/Settings"));
const PaymentsPage = lazy(() => import("@/pages/dashboard/Payments"));

// Admin pages
const AdminDashboardPage = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUserManagementPage = lazy(() => import("@/pages/admin/UserManagement"));
const AdminStudentManagementPage = lazy(() => import("@/pages/admin/StudentManagement"));
const AdminTeacherManagementPage = lazy(() => import("@/pages/admin/TeacherManagement"));
const AdminMaterialsManagementPage = lazy(() => import("@/pages/admin/MaterialsManagement"));
const AdminAIMonitoringPage = lazy(() => import("@/pages/admin/AIMonitoring"));
const AdminPaymentsFinancePage = lazy(() => import("@/pages/admin/PaymentsFinance"));
const AdminAcademicManagementPage = lazy(() => import("@/pages/admin/AcademicManagement"));
const AdminSystemSettingsPage = lazy(() => import("@/pages/admin/SystemSettings"));
const AdminReportsAnalyticsPage = lazy(() => import("@/pages/admin/ReportsAnalytics"));

/* =========================
   Reusable Wrappers
========================= */

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
    Loading...
  </div>
);

const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

const withProtected = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<Loader />}>
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    </Suspense>
  );
};

/* =========================
   Root Layout
========================= */

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

/* =========================
   Public Routes
========================= */

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => withSuspense(HomePage),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => withSuspense(AboutPage),
});

const academicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/academics",
  component: () => withSuspense(AcademicsPage),
});

const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admissions",
  component: () => withSuspense(AdmissionsPage),
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: () => withSuspense(NewsPage),
});

const clubsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clubs",
  component: () => withSuspense(ClubsPage),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: () => withSuspense(ContactPage),
});

/* =========================
   LIS Routes (Auth Flow)
========================= */

const lisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lis",
  component: () => withSuspense(LISEntryPage),
});

const lisIdentityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lis/identity",
  component: () => withSuspense(LISIdentityPage),
});

const lisSecurityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lis/security",
  component: () => withSuspense(LISSecurityPage),
});

const lisSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lis/setup",
  component: () => withSuspense(LISSetupPage),
});

const lisLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lis/login",
  component: () => withSuspense(LISLoginPage),
});

/* =========================
   Protected Dashboard Routes
========================= */

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => withProtected(DashboardLayout),
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: () => withSuspense(DashboardPage),
});

const aiHubRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/ai-hub",
  component: () => withSuspense(AIHubPage),
});

const studySessionRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/study-session",
  component: () => withSuspense(StudySessionPage),
});

const studyHistoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/study-history",
  component: () => withSuspense(StudyHistoryPage),
});

const mockExamsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/mock-exams",
  component: () => withSuspense(MockExamsPage),
});

const examProgressRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/exam-progress",
  component: () => withSuspense(ExamProgressPage),
});

const resultsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/results",
  component: () => withSuspense(ResultsPage),
});

const materialsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/materials",
  component: () => withSuspense(MaterialsPage),
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: () => withSuspense(ProfilePage),
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: () => withSuspense(SettingsPage),
});

const paymentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/payments",
  component: () => withSuspense(PaymentsPage),
});

/* =========================
   Admin Panel Routes
========================= */

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => withProtected(AdminLayout),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: () => withSuspense(AdminDashboardPage),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: () => withSuspense(AdminUserManagementPage),
});

const adminStudentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/students",
  component: () => withSuspense(AdminStudentManagementPage),
});

const adminTeachersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/teachers",
  component: () => withSuspense(AdminTeacherManagementPage),
});

const adminMaterialsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/materials",
  component: () => withSuspense(AdminMaterialsManagementPage),
});

const adminAIMonitoringRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/ai-monitoring",
  component: () => withSuspense(AdminAIMonitoringPage),
});

const adminPaymentsFinanceRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/payments",
  component: () => withSuspense(AdminPaymentsFinancePage),
});

const adminAcademicRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/academic",
  component: () => withSuspense(AdminAcademicManagementPage),
});

const adminSystemSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/settings",
  component: () => withSuspense(AdminSystemSettingsPage),
});

const adminReportsAnalyticsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/reports",
  component: () => withSuspense(AdminReportsAnalyticsPage),
});

/* =========================
   Route Tree
========================= */

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

  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
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
  ]),
  adminRoute.addChildren([
    adminDashboardRoute,
    adminUsersRoute,
    adminStudentsRoute,
    adminTeachersRoute,
    adminMaterialsRoute,
    adminAIMonitoringRoute,
    adminPaymentsFinanceRoute,
    adminAcademicRoute,
    adminSystemSettingsRoute,
    adminReportsAnalyticsRoute,
  ]),
]);

/* =========================
   Router Instance
========================= */

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}