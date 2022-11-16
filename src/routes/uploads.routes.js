const {Router} = require('express');
const { subirArchivo, updateImage, getImage } = require('../controllers/uploads.controller');
const {check} = require('express-validator');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const route = Router();

route.post('/:id', subirArchivo);
route.get('/:coleccion/:id',[
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos']))
],getImage)
route.put('/:coleccion/:id',[
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos']))
],updateImage)

module.exports = route;