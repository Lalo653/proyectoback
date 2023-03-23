const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
require('dotenv/config')
const { initializeApp } = require('firebase/app');
const { collection, getDoc ,getFirestore, setDoc,doc, getDocs, updateDoc, deleteDoc } = require( 'firebase/firestore')

//Configuracion de claves firebase
const firebaseConfig = {
    apiKey: "AIzaSyAYpvMWzHFV2Q9CUFwbjsEC6lkMaXa66eI",
    authDomain: "proyecto-5a-7eab0.firebaseapp.com",
    projectId: "proyecto-5a-7eab0",
    storageBucket: "proyecto-5a-7eab0.appspot.com",
    messagingSenderId: "973529512628",
    appId: "1:973529512628:web:0c4100f4f6c94306a6b5e1"
  };

  //inicializar BD

const firebase = initializeApp(firebaseConfig);
const db = getFirestore()

//Inicializar el servidor
const app = express()

//configuracion CORS
const corsOptions = {
    "Origin": "*",
    "OptionsSucessStatus": 200
}

app.use(express.json())
app.use(cors(corsOptions))


//configuracion Rutas
//Ruta para Insertar un nuevo registro
app.post('/create',(req, res) => {
    const { nombre, apaterno, amaterno, direccion, telefono, ciudad, estado, email} = req.body

    //Validaciones de los datos
    if(!nombre || nombre.length < 3 ){
        res.json({'alert': 'El nombre debe tener minimo 3 caracteres'})
    }else if( !apaterno || apaterno.length <3){ 
        res.json({ 'alert': 'El apaterno debe tener minimo 3 caracteres' })
    }else if(!amaterno || amaterno.length <3){ 
        res.json({ 'alert': 'El amaterno debe tener minimo 3 caracteres' })
        }else if(!direccion || direccion.length <3){ 
            res.json({ 'alert': 'La direccion debe tener minimo 3 caracteres' })
        }else if(!Number(telefono) || telefono.length != 10) {
            res.json({ 'alert': 'Escribe el numero de valido de 10 digitos'})
            }else if(!ciudad || ciudad.length <3){ 
                res.json({ 'alert': 'La ciudad debe tener minimo 3 caracteres' })
            }else if(!estado || estado.length <3){ 
                res.json({ 'alert': 'El estado debe tener minimo 3 caracteres' })
            }else if(!email || !email.length){ 
                res.json({ 'alert': 'Debes de introducir un correo electronico' })
            }else{
                const contactos = collection(db, 'contactos')

                //verificar que el correo no exita en la base de datos
                getDoc(doc(contactos, email)).then((contacto) => {
                    if(contacto.exists()) {
                        res.json({'alert': 'El correo ya esta registrado'})
                    }else{
                        const data = {
                            nombre,
                            apaterno,
                            amaterno,
                            direccion,
                            telefono,
                            ciudad,
                            estado,
                            email
                        }
                        
                        setDoc(doc(contactos, email,),data).then(() => {
                            res.json({
                                'alert': 'success'
                            })
                        })
                    }
                })
            }
                

})

//Ruta para leer o traer datos de la coleccion
app.get('/read', async(req, res ) => {
    const colContactos = collection(db, 'contactos')
    const docContactos = await getDocs(colContactos)
    let regresa = []
    docContactos.forEach((contacto) => {
        regresa.push(contacto.data())

    })
    res.json({
        'alert': 'success',
        regresa
    })


})

//Ruta para actualizar un registro de la coleccion
app.post('/update', (req, res) => {
    const{nombre, apaterno, amaterno, direccion, telefono, ciudad, estado, email} = req.body

    if(!nombre || nombre.length < 3 ){
        res.json({'alert': 'El nombre debe tener minimo 3 caracteres'})
    }else if( !apaterno || apaterno.length <3){ 
        res.json({ 'alert': 'El apaterno debe tener minimo 3 caracteres' })
    }else if(!amaterno || amaterno.length <3){ 
        res.json({ 'alert': 'El amaterno debe tener minimo 3 caracteres' })
        }else if(!direccion || direccion.length <3){ 
            res.json({ 'alert': 'La direccion debe tener minimo 3 caracteres' })
        }else if(!Number(telefono) || telefono.length != 10) {
            res.json({ 'alert': 'Escribe el numero de valido de 10 digitos'})
            }else if(!ciudad || ciudad.length <3){ 
                res.json({ 'alert': 'La ciudad debe tener minimo 3 caracteres' })
            }else if(!estado || estado.length <3){ 
                res.json({ 'alert': 'El estado debe tener minimo 3 caracteres' })
            }else if(!email || !email.length){ 
                res.json({ 'alert': 'Debes de introducir un correo electronico' })
            }else{
                const updateData = {
                    nombre,
                    apaterno,
                    amaterno,
                    direccion,
                    telefono,
                    ciudad,
                    estado
                
                }

                updateDoc(doc(db,'contactos', email),
                updateData).then(()=>{
                    res.json({
                        'alert':'update success'
                    })
                }).catch((error)=>{
                    res.json({
                        'alert':'error'

                    })
                })
            }


})  

//Ruta para borrar un registro de la coleccion
app.post('/delete', (req, res) => {

    const {email} = req.body // se obtiene el email desde el body

    const contactoBorrar = doc(db, 'contactos', email) //va a la coleccion y busca la variable con ese valor y se guarda la variable

    //console.log(contactoBorrar)

    deleteDoc(contactoBorrar)

    res.json({
        'alert':'success erased'
    })
})

//poner servidor en escucha
const PORT = process.env.PORT || 20000

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})