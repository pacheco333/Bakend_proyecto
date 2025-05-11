// importa la conexion a la base de datos desde el archivo configuracion
const db = require('../config/db');

// crear la clase ImagenesController que maneja las operaciones relacionadas
class ImagenesControllers {

    async subirImagen(tabla, campoId, id, imagenBase64) {
        try {
            //consulta si el registro con el id existe
            const [registro] = await db.query(`select * from ??  where ?? = ?`, [tabla, campoId, id]);
            if (registro.length === 0) {
                return { error: 'no se encontro el registro con el id proporcionado' };
            }
            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            const query = 'UPDATE ?? SET imagen = ? WHERE ?? = ?';
            const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

            if (result.affectedRows > 0) {
                return { message: 'imagen actualizada correctamente' };
            } else {
                return { message: 'error al actualizar la imagen' };
            }
        } catch (error) {
            console.error('error al subir la imagen', error);
            throw error;
        }
    }

    //metodo para obtener una imagen desde un registro y devolverla en formato base64

    async obtenerImagen(tabla, campoId, id) {
        try {
            const [row] = await db.query('SELECT imagen FROM ?? WHERE ?? = ?', [tabla, campoId, id]);

            if (row.length === 0) {
                return { error: 'registro no encontrado' }
            }

            if (!row[0].imagen) {
                return { error: 'no hay imagenes asociadas a este registro' };
            }

            const imagenBase64 = row[0].imagen.toString('base64');

            return { imagen: imagenBase64 };
        } catch (error) {
            console.error('error al obtener la imagen', error);
            throw error;
        }
    }

    async eliminarImagen(tabla, campoId, id) {
        try {
            const [registro] = await db.query('SELECT * FROM ?? WHERE ?? = ?', [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: 'no se encontro el registro con el id proporcionado' };
            }

            const query = 'UPDATE ?? SET imagen = NULL WHERE ?? = ?';
            const [result] = await db.query(query, [tabla, campoId, id]);

            if (result.affectedRows > 0) {
                return { message: 'imagen eliminada correctamente' };
            } else {
                return { error: 'error al eliminar la imagen' }
            }
        } catch (error) {
            console.error('error al eliminar la imagen', error);
            throw error;
        }
    }

    // Método que inserta una imagen si no existe o actualiza si ya hay una
    async insertarImagen(tabla, campoId, id, imagenBase64) {
        try {
            // Verificar que el registro exista
            const [registro] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            if (registro.length === 0) {
                return { error: 'No se encontró el registro con el ID proporcionado.' };
            }

            // Convertir la imagen a formato binario
            const bufferImagen = Buffer.from(imagenBase64, 'base64');

            // Consultar si ya hay una imagen existente
            const [imagenExistente] = await db.query(`SELECT imagen FROM ?? WHERE ?? = ?`, [tabla, campoId, id]);

            // Si ya hay una imagen, actualizar
            if (imagenExistente[0]?.imagen) {
                const query = 'UPDATE ?? SET imagen = ? WHERE ?? = ?';
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen actualizada correctamente.' };
                } else {
                    return { error: 'Error al actualizar la imagen.' };
                }
            } else {
                // Si no hay imagen, insertar una nueva
                const query = 'UPDATE ?? SET imagen = ? WHERE ?? = ?';
                const [result] = await db.query(query, [tabla, bufferImagen, campoId, id]);

                if (result.affectedRows > 0) {
                    return { message: 'Imagen insertada correctamente.' };
                } else {
                    return { error: 'Error al insertar la imagen.' };
                }
            }
        } catch (error) {
            console.error('Error al insertar la imagen:', error);
            throw error;
        }
    }

    // Método general que decide si subir una imagen o solo obtenerla
    async procesarImagen(tabla, campoId, id, imagenBase64 = null) {
        // Si se pasa una imagen, la sube
        if (imagenBase64) {
            return await this.subirImagen(tabla, campoId, id, imagenBase64);
        } else {
            // Si no, intenta recuperarla
            return await this.obtenerImagen(tabla, campoId, id);
        }
    }

}

module.exports = new ImagenesControllers();