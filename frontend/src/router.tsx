import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ProtectedRoute from "./lib/protectedRoute";
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
const ApplyPage = lazy(() => import("@/pages/Apply"));
const TrackApplicationPage = lazy(() => import("@/pages/TrackApplication"));

// Parent portal
const ParentPortalPage = lazy(() => import("@/pages/portal/ParentPortal"));

// Platform (super admin) portal
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/Dashboard"));
const AdminOrganizationsPage = lazy(() => import("@/pages/admin/Organizations"));
const AdminModelsPage = lazy(() => import("@/pages/admin/Models"));

// Staff/Org authentication
const LoginPage = lazy(() => import("@/pages/Login"));

// Org Workspace Dashboard pages
const DashboardPage = lazy(() => import("@/pages/dashboard/Dashboard"));
const OrgAdmissionsPage = lazy(() => import("@/pages/dashboard/Admissions"));
const OrgStudentsPage = lazy(() => import("@/pages/dashboard/Students"));
const OrgTeachersPage = lazy(() => import("@/pages/dashboard/Teachers"));
const MaterialsPage = lazy(() => import("@/pages/dashboard/Materials"));
const SettingsPage = lazy(() => import("@/pages/dashboard/Settings"));

/* =========================
   Reusable Wrappers
========================= */

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground font-semibold">
    <div className="animate-pulse">Loading Workspace...</div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const withProtected = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader />}>
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  </Suspense>
);

/* =========================
   Root Layout
========================= */

const rootRoute = createRootRoute({
  component: () => {
    // Authenticated surfaces (staff workspace, parent portal) carry their own
    // chrome — only public pages get the marketing Navbar/Footer.
    const path = window.location.pathname;
    const isDashboard =
      path.startsWith("/dashboard") || path.startsWith("/portal") || path.startsWith("/admin");

    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {!isDashboard && <Navbar />}
        <div className="flex-1">
          <Outlet />
        </div>
        {!isDashboard && <Footer />}
      </div>
    );
  },
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

const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apply",
  component: () => withSuspense(ApplyPage),
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: () => withSuspense(TrackApplicationPage),
});

/* =========================
   Parent Portal (protected)
========================= */

const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal",
  component: () => withProtected(ParentPortalPage),
});

/* =========================
   Platform Portal (super admin)
========================= */

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => withProtected(AdminLayout),
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: () => withSuspense(AdminDashboardPage),
});

const adminOrganizationsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/organizations",
  component: () => withSuspense(AdminOrganizationsPage),
});

const adminModelsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/models",
  component: () => withSuspense(AdminModelsPage),
});

/* =========================
   Staff/Org Login
========================= */

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => withSuspense(LoginPage),
});

/* =========================
   Protected Org Workspace Routes
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

const orgAdmissionsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/admissions",
  component: () => withSuspense(OrgAdmissionsPage),
});

const orgStudentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/students",
  component: () => withSuspense(OrgStudentsPage),
});

const orgTeachersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/teachers",
  component: () => withSuspense(OrgTeachersPage),
});

const materialsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/materials",
  component: () => withSuspense(MaterialsPage),
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: () => withSuspense(SettingsPage),
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
  applyRoute,
  trackRoute,

  loginRoute,

  portalRoute,

  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminOrganizationsRoute,
    adminModelsRoute,
  ]),

  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    orgAdmissionsRoute,
    orgStudentsRoute,
    orgTeachersRoute,
    materialsRoute,
    settingsRoute,
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