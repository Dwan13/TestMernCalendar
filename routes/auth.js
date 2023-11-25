/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const Router = require('express');
const router = Router();
const {createUser, loginUser, revalidarToken} = require('../controllers/auth');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')

router.post(
    '/new',
    [
        //MIddelwares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
    ], 
 createUser);

router.post(
    '/',
    [
        //MIddelwares
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUser);

router.get('/renew',validarJWT,revalidarToken);

module.exports = router;