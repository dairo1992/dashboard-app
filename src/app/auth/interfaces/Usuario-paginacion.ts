export interface UsuarioResponse {
  status: boolean;
  message: string;
  data: Data;
}

export interface Data {
  usuarios: Usuario[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
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
