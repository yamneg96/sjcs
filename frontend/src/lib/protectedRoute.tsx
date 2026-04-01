import { useAuthStore } from '@/store/auth.store'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, student } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: "/lis/login" })
      return;
    }

    // Role-based routing protection
    const path = window.location.pathname;
    const isAdmin = student?.role === "admin";

    if (path.startsWith("/admin") && !isAdmin) {
      router.navigate({ to: "/dashboard" });
    } else if (path.startsWith("/dashboard") && isAdmin) {
      router.navigate({ to: "/admin" });
    }
  }, [isAuthenticated, student, router])

  if (!isAuthenticated) return null

  return <>{children}</>
}

export default ProtectedRoute