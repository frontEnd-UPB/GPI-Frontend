export const AUTH_STORAGE_KEYS = {
  USER: "meddical:user",
  TOKEN: "meddical:token",
} as const;

export type AuthStorageKey = (typeof AUTH_STORAGE_KEYS)[keyof typeof AUTH_STORAGE_KEYS];
