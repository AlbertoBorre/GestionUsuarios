import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private apiUrl = '';
  private endpoint = 'usuarios';

  constructor(private http: HttpClient) {}

  private buildUrl(path: string): string {
    const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl : `${this.apiUrl}/`;
    return `${baseUrl}${path}`;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: any) {
    console.log('Error:', error);
    return throwError(() => new Error(
      error.error instanceof ErrorEvent ? 
      `Error: ${error.error.message}` : 
      `Código: ${error.status}, Mensaje: ${error.message}`
    ));
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<any[]>(this.buildUrl(this.endpoint), { headers: this.getHeaders() })
      .pipe(
        map(usuarios => usuarios.map(u => this.procesarFechasUsuario(u))),
        catchError(this.handleError)
      );
  }

  buscarUsuarios(busqueda: string): Observable<Usuario[]> {
    const params = new HttpParams().set('buscar', busqueda);
    
    return this.http
      .get<any[]>(this.buildUrl(this.endpoint), { 
        headers: this.getHeaders(),
        params
      })
      .pipe(
        map(usuarios => usuarios.map(u => this.procesarFechasUsuario(u))),
        catchError(this.handleError)
      );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http
      .get<any>(this.buildUrl(`${this.endpoint}/${id}`), { 
        headers: this.getHeaders() 
      })
      .pipe(
        map(usuario => this.procesarFechasUsuario(usuario)),
        catchError(this.handleError)
      );
  }

  crearUsuario(usuario: Omit<Usuario, 'id' | 'fechaRegistro' | 'ultimaConexion'>): Observable<Usuario> {
    return this.http
      .post<any>(this.buildUrl(this.endpoint), usuario, { 
        headers: this.getHeaders() 
      })
      .pipe(
        map(usuario => this.procesarFechasUsuario(usuario)),
        catchError(this.handleError)
      );
  }

  actualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http
      .put<any>(this.buildUrl(`${this.endpoint}/${id}`), usuario, { 
        headers: this.getHeaders() 
      })
      .pipe(
        map(usuario => this.procesarFechasUsuario(usuario)),
        catchError(this.handleError)
      );
  }

  eliminarUsuario(id: number): Observable<boolean> {
    return this.http
      .delete<{success: boolean}>(this.buildUrl(`${this.endpoint}/${id}`), { 
        headers: this.getHeaders() 
      })
      .pipe(
        map(response => response.success || true),
        catchError(this.handleError)
      );
  }

  private procesarFechasUsuario(usuario: any): Usuario {
    return {
      ...usuario,
      fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : new Date(),
      ultimaConexion: usuario.ultimaConexion ? new Date(usuario.ultimaConexion) : new Date()
    };
  }
}
