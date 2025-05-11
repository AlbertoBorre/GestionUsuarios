import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosMostrados: Usuario[] = [];
  busqueda: string = '';
  usuarioSeleccionado: Usuario | null = null;
  paginaActual: number = 1;
  usuariosPorPagina: number = 8;
  totalPaginas: number = 1;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.actualizarPaginacion();
      },
      error: (error) => {
        console.log('Error al cargar usuarios:', error);
      }
    });
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.usuariosPorPagina);
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = 1;
    }
    this.cargarUsuariosPaginados();
  }

  cargarUsuariosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.usuariosPorPagina;
    const fin = inicio + this.usuariosPorPagina;
    this.usuariosMostrados = this.usuariosFiltrados.slice(inicio, fin);
  }

  buscarUsuarios(): void {
    if (this.busqueda.trim() === '') {
      this.limpiarBusqueda();
      return;
    }
    
    this.usuarioService.buscarUsuarios(this.busqueda).subscribe({
      next: (usuarios) => {
        this.usuariosFiltrados = usuarios;
        this.paginaActual = 1;
        this.actualizarPaginacion();
      },
      error: (error) => {
        console.log('Error al buscar usuarios:', error);
      }
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
  }

  editarUsuario(): void {
    if (this.usuarioSeleccionado) {
      this.router.navigate(['/usuarios/editar', this.usuarioSeleccionado.id]);
    }
  }

  eliminarUsuario(): void {
    if (!this.usuarioSeleccionado) return;
    
    const mensaje = `¿Estás seguro de que quieres eliminar a ${this.usuarioSeleccionado.nombre} ${this.usuarioSeleccionado.apellidos}?`;
    if (!confirm(mensaje)) return;
    
    this.usuarioService.eliminarUsuario(this.usuarioSeleccionado.id).subscribe({
      next: (exito) => {
        if (exito) {
          this.cargarUsuarios();
          this.usuarioSeleccionado = null;
        }
      },
      error: (error) => {
        console.log('Error al eliminar el usuario:', error);
      }
    });
  }

  crearUsuario(): void {
    this.router.navigate(['/usuarios/crear']);
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.usuariosFiltrados = this.usuarios;
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarUsuariosPaginados();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.irAPagina(this.paginaActual + 1);
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.irAPagina(this.paginaActual - 1);
    }
  }
}
