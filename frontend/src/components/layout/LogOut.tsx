import { useAuthStore } from '@/store/auth.store'
import { useRouter } from '@tanstack/react-router'

const LogOut = () => {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.navigate({ to: "/lis/login" }) // ✅ proper redirect
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-background text-sjcs-primary"
    >
      Logout
    </button>
  )
}

export default LogOut