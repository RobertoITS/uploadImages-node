const {getConnection} = require('./../database/database');
const {request, response} = require('express');


const getUsers = async(req=request, res=response)=>{
    try {
        console.log('Controlador users');
        const connection = await getConnection();
        const result = await connection.query('SELECT username, email, role, avatar FROM users');

        res.status(200).json({
            ok:true,
            result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            error
        })
    }
}

const addUser = async(req = request, res = response)=>{
    const { username, email, role } = req.body
    const user = {
        username: username,
        email: email,
        role: role
    }
    try {
        const connection = await getConnection()
        const result = await connection.query('INSERT INTO users SET ?', user)
        res.status(200).json({
            ok: true,
            user,
            result,
            message: 'Todo ok'
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            error,
            message: 'Algo salio mal'
        })
    }
}

const updateUser = ((req = requestm, res = response)=>{
    try {
        
    } catch (error) {
        
    }
})


module.exports = {
    getUsers,
    addUser,
    updateUser
}