import { pool } from '../database/database.js'

class Usuario {
    getUsuario(campo, valor) {
        let sql;

        if(campo == 'id') {
            sql = 'CALL proc_get_usuario(?, null, null, null);';
        }else if(campo == 'login') {
            sql = 'CALL proc_get_usuario(null, ?, null, null);';
        }else if(campo == 'cpf') {
            sql = 'CALL proc_get_usuario(null, null, ?, null);';
        }else {
            sql = 'CALL proc_get_usuario(null, null, null, ?);';
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
            throw new Error('Erro ao consultar usuário!', error);
        }
    }

    getUsuarios(){
        const sql = 'CALL proc_get_usuarios';

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
            throw new Error('Erro ao consultar usuários!', error);
        }
    }

    storeUsuario(dados) {
        const {
            cpfCnpj,
            nome,
            login,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            idEndereco,
        } = dados;

        const sql = 'CALL proc_insert_usuario (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, login, email, celular, telefone, cpfCnpj, rg, dataRg, idEndereco,];

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
            throw new Error('Erro ao salvar o usuário!', error);
        }
    }

    updateUsuario(dados) {
        const {
            idUsuario,
            email,
            celular,
            telefone,
            rg,
            dataRg,
            idEndereco,
        } = dados;

        const sql = 'CALL proc_update_usuario (?, ?, ?, ?, ?, ?, ?)';
        const values = [idUsuario, email, celular, telefone, rg, dataRg, idEndereco];

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
            throw new Error('Erro ao salvar o usuário!', error);
        }
    }

    updateStatusUsuario(idUsuario, status) {
        const sql = 'CALL proc_update_status_usuario (?, ?);';
        const values = [idUsuario, status];

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
            throw new Error('Erro ao alterar status do usuário!', error);
        }
    }

    solicitaAlteracaoUsuario(dados) {
        const { campo, valorAnterior, novoValor, idUsuario, idSolicitante, motivo } = dados;

        const sql = 'CALL proc_insert_solicitacao_usuario(?, ?, ?, ?, ?, ?);';
        const values = [campo, valorAnterior, novoValor, idUsuario, idSolicitante, motivo];

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
            throw new Error('Erro ao solicitar alteração dos dados do usuário!', error);
        }
    }

    getSolicitacoesPendentesUsuario(idUsuario) {
        const sql = 'CALL proc_get_solicitacoes_pendentes_usuario(?);';
        const values = [idUsuario];

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
            throw new Error('Erro ao consultar solicitações do usuário!', error);
        }
    }

    getSolicitacoesUsuarios(tipoSolicitacao) {
        const sql = 'CALL proc_get_solicitacoes_usuarios(?);';
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

    updateSolicitacaoUsuario(dados) {
        const { idSolicitacao, novoStatus, observacao, idAprovador, tipoSolicitacao } = dados;

        const sql = 'CALL proc_update_solicitacao_usuario(?, ?, ?, ?, ?)';
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

export { Usuario };