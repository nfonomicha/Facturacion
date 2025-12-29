import { Usuarios } from "../../../../Administrador/Gestion_Usuarios/FronEnd/Entidades/usuario.js";

var usuario1 = new Usuarios(
  "Antonio Micha",
  "Ondo Eyang",
  "antonio@candyfacturas",
  222444333,
  12345678,
  "Vendedor",
  "Activo"
);
var usuario2 = new Usuarios(
  "Roberta Ada",
  "Ondo Eyang",
  "nicky@candyfacturas",
  222444333,
  12345678,
  "Administrador",
  "Activo"
);
var usuario3 = new Usuarios(
  "Diosdado Asumu",
  "Ndong Andeme",
  "dana@candyfacturas",
  222111555,
  12345678,
  "Administrador",
  "Activo"
);
var usuarios = [];
usuarios.push(usuario1);
usuarios.push(usuario2);
usuarios.push(usuario3);

var btnLogin = document.querySelector(".botonLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  let user = document.querySelector("#usuario").value;
  let contrasena = document.querySelector("#contrasena").value;

  if (user === "" || contrasena === "") {
    alert("Rellene todos los campos para poder iniciar sesión");
  } else {
    let usuarioEncontrado = false;

    for (let index = 0; index < usuarios.length; index++) {
      const element = usuarios[index];
      if (element.email === user && element.contrasena == contrasena) {
        usuarioEncontrado = true;

        if (element.rol == "Vendedor") {
          window.location.href = "../../../../../Facturador/inicio.html";
        } else if (element.rol == "Administrador") {
          sessionStorage.setItem("user", element.nombre);
          console.log(element.nombre);
          window.location.href = "../../../../../Administrador/inicio.html";
        }
        break;
      }
    }

    if (!usuarioEncontrado) {
      alert(" El usuario insertado y/o contraseña insertada son incorrectos");
    }
  }
});
