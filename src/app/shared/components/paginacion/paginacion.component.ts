import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paginacion',
  imports: [RouterLink],
  templateUrl: './paginacion.component.html',
})
export class PaginacionComponent {
  paginaActual = input<number>(1);
  paginas = input<number>(0);
  paginaActiva = linkedSignal(this.paginaActual);
  route = inject(ActivatedRoute);

  listaPaginas = computed(() => {
    return Array.from({ length: this.paginas() }, (_, i) => i + 1);
  });
}
