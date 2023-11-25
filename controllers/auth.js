const {response} = require('express');
const bcrypt = require('bcryptjs');
const {validationResult}= require('express-validator')
const Usuario = require('../models/Usuario')
const {generarJWT} = require('../helpers/jwt');
const createUser = async(req, res = response)=>{
    //console.log('se require /');
    //console.log(req.body);

    const {email, password} = req.body;
   
    // if (name.length < 5) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg:'El nombre debe de ser de 5 letras'
    //     })
    // }

    //Manejo de errores

    // const errors = validationResult(req);
    // //console.log(errors);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     })
    // }


    try {
        let usuario = await Usuario.findOne({email});
        

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();//revisar el numero de dificultad agregando un numero como parametro
        usuario.password = bcrypt.hashSync(password, salt);
        


        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json
        ({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
    
}

const loginUser = async (req, res = response)=>{
    const {email, password} = req.body
    try {
        const usuario = await Usuario.findOne({email});
        

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctos'
            });
        }

        //Confirmar password

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            res.status(400).json
            ({
                ok: false,
                msg: 'Password Incorrecto'
            });
        }

        //Generar Nuestro JWT
        const token = await generarJWT(usuario.id, usuario.name);


        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json
        ({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
    // res.status(201).json({
    //     ok:true,
    //     msg: 'login',
    //     uid,
    //     password
    // })
};

const revalidarToken = async(req, res = response)=>{
    //console.log('se require /');
    const uid = req.uid;
    const name = req.name;

    //generar nuevo JWT y retornarlo en esta petición
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        token
    })
};

module.exports = {createUser, loginUser, revalidarToken}