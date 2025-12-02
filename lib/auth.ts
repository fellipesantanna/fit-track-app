"use client"

// Simple localStorage-based auth system
const authApi = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    const currentUser = localStorage.getItem("currentUser")
    return !!currentUser
  },

  getCurrentUser(): { id: string; name: string; email: string } | null {
    if (typeof window === "undefined") return null
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) return null
    try {
      return JSON.parse(currentUser)
    } catch {
      return null
    }
  },

  async login(email: string, password: string) {
    if (typeof window === "undefined") {
      return { success: false, error: "Not available on server" }
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return { success: false, error: "Usuário não encontrado" }
    }

    if (user.password !== password) {
      return { success: false, error: "Senha incorreta" }
    }

    localStorage.setItem("currentUser", JSON.stringify({ id: user.id, name: user.name, email: user.email }))
    return { success: true, user: { id: user.id, name: user.name, email: user.email } }
  },

  async register(name: string, email: string, password: string) {
    if (typeof window === "undefined") {
      return { success: false, error: "Not available on server" }
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: "Email já cadastrado" }
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }))

    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }
  },

  async logout() {
    if (typeof window === "undefined") return
    localStorage.removeItem("currentUser")
  },

  async updateName(name: string) {
    if (typeof window === "undefined") {
      return { success: false, error: "Not available on server" }
    }

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Usuário não autenticado" }
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id)

    if (userIndex === -1) {
      return { success: false, error: "Usuário não encontrado" }
    }

    users[userIndex].name = name
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, name }))

    return { success: true, user: { ...currentUser, name } }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    if (typeof window === "undefined") {
      return { success: false, error: "Not available on server" }
    }

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "Usuário não autenticado" }
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id)

    if (userIndex === -1) {
      return { success: false, error: "Usuário não encontrado" }
    }

    if (users[userIndex].password !== currentPassword) {
      return { success: false, error: "Senha atual incorreta" }
    }

    users[userIndex].password = newPassword
    localStorage.setItem("users", JSON.stringify(users))

    return { success: true }
  },

  async forgotPassword(email: string) {
    if (typeof window === "undefined") {
      return { success: false, error: "Not available on server" }
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      return { success: false, error: "Email não encontrado" }
    }

    // In a real app, this would send an email
    // For now, just return success
    return { success: true, message: "Um link de recuperação seria enviado para o seu email" }
  },
}

export const auth = authApi
export { authApi }
export default authApi

export function createSupabaseClient() {
  throw new Error("Supabase is not configured. This app uses localStorage-based authentication.")
}
