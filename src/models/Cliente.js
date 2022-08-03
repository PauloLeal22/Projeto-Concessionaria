import { pool } from "../database/database.js";

class Cliente {
    getCliente(campo, valor) {
        let sql;

        if(campo == 'id') {
            sql = 'CALL proc_get_cliente(?, null, null);';
        }else if(campo == 'cpf') {
            sql = 'CALL proc_get_cliente(null, ?, null);';
        }else {
            sql = 'CALL proc_get_cliente(null, null, ?);';
        }

        const values = [valor];

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
            throw new Error('Erro ao consultar  o cliente!', error);
        }
    }

    getClientes(){
        const sql = 'CALL proc_get_clientes';

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows[0]);
                        connection.release();
                    });
                });
            });
        } catch (error) {
            throw new Error('Erro ao consultar clientes!', error);
        }
    }

    storeCliente(dados) {
        const {
            cpfCnpj,
            nome,
            sexo,
            dataNasc,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            idUsuario,
            idEndereco,
        } = dados;

        const sql = 'CALL proc_insert_cliente (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, sexo, dataNasc, email, celular, telefone, cpfCnpj, rg, dataRg, idUsuario, idEndereco,];

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
            throw new Error('Erro ao salvar o cliente!', error);
        }
    }

    updateCliente(dados) {
        const {
            idCliente,
            sexo,
            dataNasc,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            idEndereco,
        } = dados;

        const sql = 'CALL proc_update_cliente (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [idCliente, sexo, dataNasc, email, celular, telefone, rg, dataRg, idEndereco];

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
            throw new Error('Erro ao salvar o cliente!', error);
        }
    }

    solicitaAlteracaoCliente(dados) {
        const { campo, valorAnterior, novoValor, idCliente, idSolicitante, motivo } = dados;

        const sql = 'CALL proc_insert_solicitacao_cliente(?, ?, ?, ?, ?, ?);';
        const values = [campo, valorAnterior, novoValor, idCliente, idSolicitante, motivo];

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, values, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows);
                        connection.release();
                    });
                });
            })
        } catch (error) {
            throw new Error('Erro ao solicitar alteração dos dados do cliente!', error);
        }
    }

    getSolicitacoesPendentesCliente(idCliente) {
        const sql = 'CALL get_solicitacoes_pendentes_cliente (?);';
        const values = [idCliente];

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, values, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows);
                        connection.release();
                    });
                });
            })
        } catch (error) {
            throw new Error('Erro ao consultar solicitações do cliente!', error);
        }
    }

    getSolicitacoesClientes(tipoSolicitacao) {
        const sql = 'CALL proc_get_solicitacoes_clientes(?);';
        const values = [tipoSolicitacao];

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
            })
        } catch (error) {
            throw new Error('Erro ao consultar solicitações!', error);
        }
    }

    updateSolicitacaoCliente(dados) {
        const { idSolicitacao, novoStatus, observacao, idAprovador, tipoSolicitacao } = dados;

        const sql = 'CALL proc_update_solicitacao_cliente(?, ?, ?, ?, ?)';
        const values = [idSolicitacao, novoStatus, observacao, idAprovador, tipoSolicitacao];

        try {
            return new Promise((res, rej) => {
                pool.getConnection((err, connection) => {
                    if(err)
                        rej(err);
                    connection.query(sql, values, (err, rows) => {
                        if(err)
                            rej(err);
                        else
                            res(rows);
                        connection.release();
                    });
                });
            })
        } catch (error) {
            throw new Error('Erro ao aprovar/reprovar a solicitação!', error);
        }
    }
}

export { Cliente };