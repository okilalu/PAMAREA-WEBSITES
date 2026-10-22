import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
  logoutAll,
} from "../../services/auth/auth.service";

import type {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../../types/auth/auth";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// GET /auth/me
export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled,
    retry: false,
  });
};

// POST /auth/register
export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  });
};

// POST /auth/login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
    },
    onError(error) {
      console.log(error);
    },
  });
};

// POST /auth/refresh
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (payload: RefreshTokenRequest) => refreshToken(payload),
  });
};

// POST /auth/logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

// POST /auth/logout-all
export const useLogoutAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAll,

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });

      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};
