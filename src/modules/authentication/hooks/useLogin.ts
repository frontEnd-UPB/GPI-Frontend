import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const user = await signIn({ email, password });
      return {
        token: localStorage.getItem("meddical:token") ?? "",
        user,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { login, isLoading: loading, error };
};