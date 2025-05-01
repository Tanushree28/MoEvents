// src/schemas.ts
export interface LoginResponse {
    token: string;
    type:  "bearer";
    role:  "admin" | "student";   // <— add this
  }
  