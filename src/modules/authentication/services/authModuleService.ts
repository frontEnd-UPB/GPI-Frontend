import { mockEmployees } from "../../../core/mocks/data";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  }

export const authModuleService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockEmployees.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          resolve({
            token: "fake-jwt-token",
            user: userWithoutPassword,
          });
        } else {
          reject(new Error("Credenciales inválidas. Por favor intente de nuevo."));
        }
      }, 1000);
    });
  },
};