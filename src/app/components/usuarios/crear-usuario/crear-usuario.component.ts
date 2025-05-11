import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {

  usuarioForm: FormGroup;
  isValido = false;
  roles = ['Administrador', 'Soporte', 'Usuario'];
  estados = ['Activo', 'Inactivo'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.usuarioForm = this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      apellidos: ['', [Validators.required, Validators.minLength(1)]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
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
    
    const nuevoUsuario = {
      nombre: this.usuarioForm.value.nombre,
      apellidos: this.usuarioForm.value.apellidos,
      contraseña: this.usuarioForm.value.contraseña,
      correoElectronico: this.usuarioForm.value.correoElectronico,
      telefono: this.usuarioForm.value.telefono,
      rol: this.usuarioForm.value.rol,
      estado: this.usuarioForm.value.estado as 'Activo' | 'Inactivo',
      empresa: this.usuarioForm.value.empresa,
      ciudad: this.usuarioForm.value.ciudad
    };
    
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.log('Error al crear el usuario:', error);
        alert('Error al crear el usuario');
      }
    });
  }

  get user() {
    return this.usuarioForm.controls;
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

}
