import express from "express";

import { LoginController } from './controllers/LoginController.js';
import { UsuarioController } from "./controllers/UsuarioController.js";

import { auth } from "./middlewares/auth.js";

const router = express.Router();

const loginController = new LoginController();
const usuarioController = new UsuarioController();

router.get('/login', loginController.index);
router.post('/auth', loginController.auth);

//router.use(auth);
router.get('/home', loginController.home);

router.get('/usuarios', usuarioController.renderLista);
router.get('/usuarios/cadastro', usuarioController.renderCadastro);
router.get('/usuario/:id', usuarioController.getUsuarioById);
router.post('/usuario/cpf', usuarioController.getUsuarioByCpf);
router.post('/usuario/login', usuarioController.getUsuarioByLogin);
router.post('/usuario/email', usuarioController.getUsuarioByEmail);
router.post('/usuario', usuarioController.store);
router.patch('/usuario', usuarioController.update);
router.post('/usuario/status', usuarioController.updateStatusUsuario);
router.post('/usuario/solicitacao', usuarioController.solicitaAlteracao);
router.get('/usuarios/solicitacoes/:tipoSolicitacao', usuarioController.renderListaSolicitacoes);
router.patch('/usuarios/solicitacao', usuarioController.updateSolicitacao);

export { router };