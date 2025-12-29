let u = sessionStorage.getItem("user");
console.log(u);

let h = document.querySelector("#nombreUsuario");
h.textContent = `Señor/a ${u}`;
