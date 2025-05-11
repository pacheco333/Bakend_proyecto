const db = require('../config/db');

class CrudController{ //es una clase que maneja todas las operaciones crud

    //metodo para obtrener los registos de una tabla
    async obtenerTodos(tabla){
        try{
            const [resultados] = await db.query(`SELECT * FROM ${tabla}`);
            return resultados;
        }catch(error){
            throw error;
        }
    }

    //metodo para obtener un unico registro por su id
    async obtenerUno(tabla, idCampo, id){
        try{
            const [resultado] = await db.query(`SELECT * FROM ?? WHERE ?? = ?`,[tabla, idCampo, id]);
            return resultado[0];
        }catch(error){
            throw error;
        }
    }

    //metodo pa4ra crear un nuevo registro
    async crear(tabla, data){
        try{
            const [resultado] = await db.query(`INSERT INTO ?? SET ?`, [tabla,data]);
            return{...data, id: resultado.insertId};
        }catch(error){
            throw error;
        }
    }

    //METODO PARA ACtuALIZAR un registro existente

    async actualizar(tabla, idCampo, id, data){
        try{
            const [resultado] = await db.query(`UPDATE ?? SET ? WHERE ?? = ?`,[tabla, data, idCampo, id]);
            if(resultado.affectedRows === 0){
                throw new error('registro no encotrado');
            }
            return await this.obtenerUno(tabla, idCampo,id);
        }catch(error){
            throw error;
        }
    }

    //metodo para eliminar un registro
    async eliminar(tabla, idCampo,id){
        try{
            const [resultado] = await db.query(`DELETE FROM ?? WHERE ?? = ?`,[tabla,idCampo,id]);
            if(resultado.affectedRows === 0){
                throw new error('registro no encotrado');
            }
            return {message: 'registro eliminado correctamente'}
        }catch(error){
            throw error;
        }
    }
}
// se exporta la clase para poderla utilizar en otros archivos
module.exports = CrudController;
