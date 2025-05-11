import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  usuarioId: number;
  usuario: Usuario | null = null;
  modoEdicion = true;
  isValido = false;
  cargando = false;
  
  roles = ['Administrador', 'Soporte', 'Usuario'];
  estados = ['Activo', 'Inactivo'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.usuarioId = 0;
    this.usuarioForm = this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usuarioId = +params['id'];
        this.cargarUsuario();
      } else {
        this.modoEdicion = false;
        this.router.navigate(['/usuarios']);
      }
    });
  }

  cargarUsuario(): void {
    this.cargando = true;
    this.usuarioService.getUsuario(this.usuarioId).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
          this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correoElectronico: usuario.correoElectronico,
            telefono: usuario.telefono,
            rol: usuario.rol,
            estado: usuario.estado,
            empresa: usuario.empresa || '',
            ciudad: usuario.ciudad || ''
          });
        } else {
          this.router.navigate(['/usuarios']);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.log('Error al cargar el usuario:', error);
        this.router.navigate(['/usuarios']);
        this.cargando = false;
      }
    });
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      contraseña: ['', [Validators.minLength(6)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      rol: ['', [Validators.required]],
      estado: ['Activo', [Validators.required]],
      empresa: [''],
      ciudad: ['']
    });
  }

  onSubmit(): void {
    this.isValido = true;
    if (this.usuarioForm.invalid) {
      return;
    }
    
    const usuarioActualizado: Partial<Usuario> = {
      nombre: this.usuarioForm.value.nombre,
      apellidos: this.usuarioForm.value.apellidos,
      correoElectronico: this.usuarioForm.value.correoElectronico,
      telefono: this.usuarioForm.value.telefono,
      rol: this.usuarioForm.value.rol,
      estado: this.usuarioForm.value.estado as 'Activo' | 'Inactivo',
      empresa: this.usuarioForm.value.empresa,
      ciudad: this.usuarioForm.value.ciudad
    };
    
    if (this.usuarioForm.value.contraseña) {
      usuarioActualizado.contraseña = this.usuarioForm.value.contraseña;
    }
    
    this.usuarioService.actualizarUsuario(this.usuarioId, usuarioActualizado).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.log('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario');
      }
    });
  }

  get user() { return this.usuarioForm.controls; }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

}
