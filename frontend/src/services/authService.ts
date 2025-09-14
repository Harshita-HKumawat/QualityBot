const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "student"
    | "engineer"
    | "msme"
    | "guest"
    | "student-chatbot"
    | "engineer-chatbot"
    | "msme-chatbot";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private tokenKey = "qualitybot-auth-token";
  private userKey = "qualitybot-user-data";

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Store user data in localStorage
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get user data from localStorage
  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Remove user data from localStorage
  removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed. Please check your credentials.");
      }

      const data = await response.json();

      // Store token and user data
      this.setToken(data.token);
      this.setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Signup user
  async signup(userData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed. Please try again.");
      }

      const data = await response.json();

      // Store token and user data
      this.setToken(data.token);
      this.setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      return {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        token: data.token,
      };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  // Verify token with backend
  async verifyToken(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear stored data
        this.logout();
        return null;
      }

      const userData = await response.json();
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      // Update stored user data
      this.setUser(user);
      return user;
    } catch (error) {
      console.error("Token verification error:", error);
      this.logout();
      throw new Error("Session expired or invalid. Please log in again."); // Added user-friendly message
    }
  }

  // Logout user
  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Get auth headers for API calls
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
