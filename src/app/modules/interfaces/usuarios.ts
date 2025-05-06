export interface UsuarioResponse {
  status: boolean;
  message: Usuario[];
}

export interface Usuario {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  role: string;
  created_at: Date;
  updated_at: Date;
}
