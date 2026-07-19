import { useAuthStore } from '@/store/auth.store'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: "/login" })
      return;
    }

    /**
     * Role-based landing. The authenticated surfaces are deliberately separate
     * (§7.1): SuperAdmin → /admin, Parent → /portal, org staff → /dashboard.
     * Parents must never land in the staff workspace.
     */
    const path = window.location.pathname;
    const isAdmin = user?.role === "SuperAdmin";
    const isParent = user?.role === "Parent";

    if (path.startsWith("/admin") && !isAdmin) {
      router.navigate({ to: isParent ? "/portal" : "/dashboard" });
    } else if (path.startsWith("/portal") && !isParent) {
      router.navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    } else if (path.startsWith("/dashboard") && isParent) {
      router.navigate({ to: "/portal" });
    } else if (path.startsWith("/dashboard") && isAdmin) {
      router.navigate({ to: "/admin" });
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated) return null

  return <>{children}</>
}

export default ProtectedRoute