// src/app/core/models/user.model.ts
export interface User {
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: string;
  token?: string;
  profileImageUrl?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
