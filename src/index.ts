/* eslint-disable linebreak-style */
import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

const auth = admin.auth();

/**
 *
 * La función que se agrega al exports (en este caso agregarAdministrador) es la función
 * que va a consumir el frontend al momento de consumir recursos del servidor.
 *
 * la funcion .onCall recive dos parametros en el callback "data" y "context"
 *
 * La "data" son los datos que nos envian desde el frontend
 *
 * El "context" son las credenciales de la petición que nos llega desde el frontend.
 *
 * **Esta función se va a encargar como indica su nombre, de agregar a un nuevo administrador.
 *
 */
exports.agregarAdministrador = functions.https.onCall((data, context) => {
    // Comprobamos si las credenciales de la petición contiene los permisos de administrador.
    if (context.auth?.token.admin !== true) {
        return {error: "No tienes los permisos"};
    }

    // Primero obtenemos al usuario mediante su email, esto devuelve una promesa con las credenciales
    // del usuario.
    return auth.getUserByEmail(data.email).then((user) => {
        // Luego de hacer esa priemra busqueda retornamos un setCustomUserClaims en el cual debemos enviar
        // como primer argumento el uid del usuario y luego la propidad que deseamos cambiar en este. Esta
        // función devuelve una promesa la cual retorna la "response" que se devuelve al frontend.
        return auth
            .setCustomUserClaims(user.uid, {admin: true})
            .then(() => {
                // http response.
                return {message: "se creo el administrador"};
            })
            .catch((error) => {
                return {error};
            });
    });
});

exports.eliminarAdministrador = functions.https.onCall((data, context) => {
    if (context.auth?.token.admin !== true) {
        return {
            error: "No cuenta con los permisos para realizar esta acción",
        };
    }

    return auth.getUserByEmail(data.email).then((user) => {
        return auth
            .setCustomUserClaims(user.uid, {admin: false})
            .then(() => {
                return {message: "Usuario ya no es administrador"};
            })
            .catch((error) => {
                return {error};
            });
    });
});
exports.crearAutor = functions.https.onCall((data, context) => {
    if (context.auth?.token.admin !== true) {
        return {
            error: "No cuenta con los permisos para realizar esta acción",
        };
    }

    return auth.getUserByEmail(data.email).then((user) => {
        return auth
            .setCustomUserClaims(user.uid, {author: true})
            .then(() => {
                return {message: "El usuario ahora es author"};
            })
            .catch((error) => {
                return {error};
            });
    });
});
exports.eliminarRoles = functions.https.onCall((data, context) => {
    if (context.auth?.token.admin !== true) {
        return {
            error: "No cuenta con los permisos para realizar esta acción",
        };
    }

    return auth.getUserByEmail(data.email).then((user) => {
        return auth
            .setCustomUserClaims(user.uid, {author: false, admin: false})
            .then(() => {
                return {message: "El usuario ahora es invitado"};
            })
            .catch((error) => {
                return {error};
            });
    });
});
exports.eliminarAuthor = functions.https.onCall((data: {email: string}, context) => {
    if (context.auth?.token.admin !== true || context.auth?.token.author !== true) {
        return {
            error: "No cuenta con los permisos para realizar esta acción",
        };
    }

    return auth.getUserByEmail(data.email).then((user) => {
        return auth
            .setCustomUserClaims(user.uid, {author: false})
            .then(() => {
                return {message: "El usuario ya no es author"};
            })
            .catch((error) => {
                return {error};
            });
    });
});
