import { pool } from '../database/database.js'

class Endereco {
    getEndereco(cep, logradouro, numero) {
        const sql = 'CALL proc_get_endereco(?, ?, ?)';
        const values = [cep, logradouro, numero];

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, values, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows[0]);
                        connection.release();
                    });
                });
            });
        } catch (error) {
            throw new Error('Erro ao consultar endereço!', error);
        }
    }

    storeEndereco(dados) {
        const {
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            estado,
            cidade,
        } = dados;

        const sql = 'CALL proc_insert_endereco(?, ?, ?, ?, ?, ?, ?)';
        const values = [logradouro, numero, cep, complemento, bairro, cidade, estado];

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, values, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows[0]);
                        connection.release();
                    });
                });
            });
        } catch (error) {
            throw new Error('Erro ao salvar  o endereço!', error);
        }
    }
}

export { Endereco };