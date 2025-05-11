export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    correoElectronico: string;
    telefono: string;
    rol: string;
    estado: 'Activo' | 'Inactivo';
    fechaRegistro: Date;
    ultimaConexion: Date;
    contraseña?: string;
    empresa?: string;
    ciudad?: string;
}
