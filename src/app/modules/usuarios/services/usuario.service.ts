import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject, effect, untracked } from "@angular/core";
import { QueryClient, injectMutation, injectQuery, keepPreviousData } from "@tanstack/angular-query-experimental";
import { lastValueFrom, catchError, of, tap } from "rxjs";
import { Usuario, UsuarioResponse } from "src/app/auth/interfaces/Usuario-paginacion";
import { PaginacionService } from "src/app/shared/components/paginacion/paginacion.service";
import { AlertService } from "src/app/shared/services/alert.service";
import { environment } from "src/environments/environment";

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  paginacionService = inject(PaginacionService);
  readonly queryClient = inject(QueryClient);
  alertService = inject(AlertService);

  // Lógica de fetch con validación de caché
  private fetchUsuarios = (page: number, limit: number) => {
    const queryKey = ['usuarios', { page, limit }];
    const cached = this.queryClient.getQueryState<UsuarioResponse>(queryKey);

    // Si hay cache y no está stale, devolvemos desde cache
    if (cached && cached.status === 'success' && !this.queryClient.isFetching({ queryKey })) {
      return Promise.resolve(this.queryClient.getQueryData(queryKey) as UsuarioResponse);
    }

    // Si no hay cache o está stale, hacemos fetch y actualizamos
    const params: HttpParams = new HttpParams().set('por_pagina', limit).set('page', page.toString());
    return lastValueFrom(this.http.get<UsuarioResponse>(`${BASE_URL}/usuarios`, { params }).pipe(
      catchError(() => of({
        status: false,
        message: 'Error',
        data: { usuarios: [], pagination: {} as any }
      }))
    )).then(res => {
      this.queryClient.setQueryData(queryKey, res);
      return res;
    });
  };

  usuariosQuery = injectQuery(() => ({
    queryKey: ['usuarios', { page: this.paginacionService.paginaActual(), limit: this.paginacionService.limitePorPagina() }],
    queryFn: () => this.fetchUsuarios(this.paginacionService.paginaActual(), this.paginacionService.limitePorPagina()),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutos de vigencia
    initialDataUpdatedAt: () => Date.now()
  }));

  readonly prefetchEffect = effect(() => {
    const data = this.usuariosQuery.data();
    const isPlaceholderData = this.usuariosQuery.isPlaceholderData();
    const currentPage = this.paginacionService.paginaActual();
    const limit = this.paginacionService.limitePorPagina();
    const newPage = currentPage + 1;

    untracked(() => {
      if (!isPlaceholderData && currentPage < data?.data.pagination.last_page) {
        const nextKey = ['usuarios', { page: newPage, limit }];
        if (!this.queryClient.getQueryData(nextKey)) {
          void this.fetchUsuarios(newPage, limit); // usa la misma lógica con cache
        }
      }
    });
  });

  nuevoUsuario = injectMutation(() => ({
    mutationFn: (usuario: any) => lastValueFrom(this.http.post<UsuarioResponse>(`${BASE_URL}/register`, usuario)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      this.alertService.success("Usuario creado correctamente")
    },
    onError: (error, variables, context) => {
      this.alertService.error("Error al crear el usuario")
    },
  }));

  actualizarUsuario = injectMutation(() => ({
    mutationFn: (usuario: any) => lastValueFrom(this.http.patch<UsuarioResponse>(`${BASE_URL}/usuarios`, usuario)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      this.alertService.success("Usuario actualizado correctamente")
    },
    onError: (error, variables, context) => {
      this.alertService.error("Error al actualizado el usuario")
    },
  }));


}
