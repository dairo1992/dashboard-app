export interface AuthResponse {
  status: boolean;
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  role: string;
  created_at: Date;
  updated_at: Date;
}
