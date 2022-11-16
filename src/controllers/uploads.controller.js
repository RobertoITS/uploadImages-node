const { request, response } = require('express');
const { getConnection } = require('../database/database');
const { cargarArchivos } = require('../helpers/cargar-archivos');
const path = require('path');
const fs = require('fs');

//Terminado:
//Para subir imagenes con postman: body -> form-data -> el campo tiene que ser igual al que se pone en req.files."nombre"
const subirArchivo = async(req = request, res=response)=>{

  //*Obtenemos el id del header
  const id = req.params.id

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).send('Los archivos no han sido subidos.');
    return;
  }

  //* Obtenemos el nombre del archivo para guardarlo como ref. de la usuario:
  const avatar = await cargarArchivos(req.files, undefined,'images/users');
  const user = {
    avatar: avatar
  }
  console.log(id, avatar);
  try {
    console.log(id, avatar);
    //*Generamos la conexion y guardamos el nombre en la base
    const connect = await getConnection()
    console.log(connect);
    const result = await connect.query('UPDATE users SET ? WHERE id = ?', [user, id])
    console.log(result);
    res.status(200).json({
      ok: true,
      avatar,
      result
    })
  } catch (e){
    res.status(400).json({
      ok: false,
      msg: 'Algo malio sal'
    })
  }

}


const updateImage = async(req = request, res=response)=>{

  const {id, coleccion} = req.params;

  const connection = await getConnection()

  switch(coleccion){
    case'users':
        const user = await connection.query('SELECT id, avatar FROM users WHERE id = ? ', id);
        console.log(user)
        if(user.length<1){
          return res.status(400).json({
            msg: `No existe usuario con id: ${id}`
          })
        }else{

          //limpiar imagenes previas

          const img = user[0].avatar;
          try {
            if(img){
              const pathImage = path.join(__dirname, '../uploads/images', coleccion, img);
              if(fs.existsSync(pathImage)){
                fs.unlinkSync(pathImage);
              }
            }
          } catch (error) {
            
          }

          const nombreImagen = await cargarArchivos(req.files, undefined,'images/users');
          await connection.query('Update users set avatar=? where id = ?', [nombreImagen, id]);

          res.status(200).json({
            ok:true,
            msg:'imagen actualizada con exito!'
          })

        }
        
        break;

        case'producto':
        const producto = await connection.query('SELECT id FROM ? WHERE id = ? ', [coleccion, id]);

        if(user.length<1){
          return res.status(400).json({
            msg: `No existe producto con id: ${id}`
          })
        }
        
        break;

    default:
      return res.status(500).json({msg: 'Coleccion no permitida'})
  }
}


const getImage = async (req=request, res=response)=>{
  const {id, coleccion} = req.params;

  const connection = await getConnection();
  const user = await connection.query('SELECT id, avatar FROM users WHERE id = ? ', id);
  if(user.length<1){
    return res.status(400).json({
      msg: `No existe usuario con id: ${id}`
    })
  }else{

    //limpiar imagenes previas

    const img = user[0].avatar;
    try {
      if(img){
        const pathImage = path.join(__dirname, '../uploads/images', coleccion, img);
        if(fs.existsSync(pathImage)){
          console.log(pathImage);
          return res.sendFile(pathImage)
        }
      }
    } catch (error) {
      res.status(500).json({
        ok:false,
        msg:error.msg
      })
    }
  }

  res.json({
    msg: 'Falta place Holder'
  })
  
022
}


module.exports = {
    subirArchivo,
    updateImage,
    getImage
}