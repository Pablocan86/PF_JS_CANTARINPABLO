//CLASE MOLDE PARA EJERCICIOS
class Ejercicio {
  constructor(id, nombre, musculo, video, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.musculo = musculo;
    this.video = video;
    this.imagen = imagen;
  }
}

//variable para obtener datos de alumnos del Storage
const alumnosGuardados = JSON.parse(localStorage.getItem("LISTA ALUMNOS"));

//ARRAY ALUMNOS, si no encuentra nada devuelve vacío
const alumnos = alumnosGuardados || [];

//CLASE QUE SIMULA BASE DE DATO, TOMANDO DATOS DEL JSON
class BaseDeDatos {
  constructor() {
    this.ejerciciosBD = [];

    this.cargarRegistros();
  }
  async cargarRegistros() {
    const resultado = await fetch(`json/ejercicios.json`);
    this.ejerciciosBD = await resultado.json();
    console.log(this.ejerciciosBD);
  }
  //FUNCION QUE BUSCA POR GRUPO MUSCULAR
  registrosPorMusculos(musculo) {
    return this.ejerciciosBD.filter((m) => m.musculo == musculo);
  }
}

const bd = new BaseDeDatos();

//ELEMENTOS DEL DOM

const dias = document.querySelector("#dias");
const btnDia = document.querySelector("#btnDia");
const seccionRutina = document.querySelector("#rutina");
const series = document.querySelector("#series");
const inputBuscar = document.querySelector("#inputBuscador");
const btnAgregaEjercicio = document.querySelector("#btnAgregaEjercicio");
const seccionIngresoDatos = document.querySelector("#sectionPrimera");
const divResultados = document.querySelector("#resultados");
const botonesCategorias = document.querySelectorAll(".btnCategoria");
const body = document.querySelector("#body");
const informacionMusculos = document.getElementById("informacionMusculos");

//EVENTO PARA MOSTRAR EJERCICIOS POR MUSCULO (LA IDEA ES QUE SE PUEDAN VER EN UN DIV POSITION ABSOLUTE)
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    informacionMusculos.classList.add("musculos");
    informacionMusculos.classList.remove("ocultar");
    const nombre = bd.registrosPorMusculos(boton.dataset.musculo);
    //VER COMO HACER PARA QUE APAREZCA EN PANTALLA
    nombre.forEach((ejercicio) => {
      informacionMusculos.innerHTML += `
      <div class="divFiltro">
      <p >* ${ejercicio.nombre}</p>
      </div>`;

      informacionMusculos;
      const divFiltro = document.querySelector(".divFiltro");
      divFiltro.innerHTML = `<div class="df"><button id="btnCerrarEje">CERRAR</button></div>`;
      const cerrar = document.querySelector("#btnCerrarEje");
      cerrar.addEventListener("click", () => {
        informacionMusculos.classList.add("ocultar");
        informacionMusculos.innerHTML = " ";
      });
    });

    //Quitar seleccionado anterior
    const botonSeleccionado = document.querySelector(".seleccionado");
    botonSeleccionado.classList.remove("seleccionado");
    //Se agrega al botón que seleccionamos
    boton.classList.add("seleccionado");
  });
});

btnDia.addEventListener("number", () => {
  const dia = btnDia.number;
  console.log(dia);
});
//EVENTO QUE AGREGA EL NÚMERO DE DIA
btnDia.addEventListener("click", function () {
  rutina.innerHTML += `<div class="tituloDia"><h3 data-id="">DIA DE ENTRENAMIENTO: ${dias.value}</h3><a href="#" class="btnQuitarDia" data-id="${dias.value}"><img class="imagenX" src="./img/cerrar.png" alt="icono de una x"/></a></div>`;
  const botonesQuitar = document.querySelectorAll(".btnQuitarDia");
  for (const boton of botonesQuitar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idDia = Number(boton.dataset.id);
      const diaAEliminar = document.querySelector(`[data-id="${idDia}"]`);
      if (diaAEliminar) {
        seccionRutina.removeChild(diaAEliminar.parentElement);
      }
    });
  }
});
//Arreglo para ir subiendo los ejercicios que asigno a la rutina
const ejerciciosRutina = [];
//Botón que agrega el ejercicio seleccionado en el buscador en la sección de rutina
btnAgregaEjercicio.addEventListener("click", function () {
  //Buscao por indice la coincidicencia que existe en el array de los ejercicios
  const ejercicio = inputBuscar.value.toUpperCase();
  const indice = bd.ejerciciosBD.findIndex((el) => el.nombre === ejercicio);
  //Renderizo en la sección de rutina asi se visualizan los ejercicios
  seccionRutina.innerHTML += `<div class="ejercicio">
  <img class="imagenM" src="./img/${bd.ejerciciosBD[indice].imagen}" alt="icono video"/>
  <p>${bd.ejerciciosBD[indice].musculo}</p>
    <p>${bd.ejerciciosBD[indice].nombre}</p>
    <p>SERIES Y REPETICIONES: ${series.value}</p>
    <a href="${bd.ejerciciosBD[indice].video}" target="_blank"><img class="imagenV" src="./img/video.png" alt="icono video"/></a>
    <a href="#" class="btnQuitar" data-id="${bd.ejerciciosBD[indice].id}"><img class="imagenX" src="./img/cerrar.png" alt="icono de una x"/></a>
  </div>`;
  //Pusheo el array de ejercicioRutina para tener una lista guardada
  ejerciciosRutina.push(bd.ejerciciosBD[indice]);
  //Necesito un botón eliminar para sacar de a un ejercicio si fuera necesario
  const botonesQuitar = document.querySelectorAll(".btnQuitar");
  //Recorro los botones existentes para crear el evento

  for (const boton of botonesQuitar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();

      const idEjercicio = Number(boton.dataset.id);
      const ejercicioAEliminar = document.querySelector(
        `[data-id="${idEjercicio}"]`
      );
      if (ejercicioAEliminar) {
        seccionRutina.removeChild(ejercicioAEliminar.parentElement);
        // Eliminar el ejercicio de ejerciciosRutina
        const indiceAEliminar = ejerciciosRutina.findIndex(
          (el) => el.id === idEjercicio
        );
        if (indiceAEliminar !== -1) {
          ejerciciosRutina.splice(indiceAEliminar, 1);
        }
      }
    });
  }
});

//Input buscador que despliega una lista de las coincidencias

// Evento input para detectar la entrada del usuario
inputBuscar.addEventListener("input", function () {
  const textoBuscado = inputBuscar.value.trim().toUpperCase();

  // Limpia el contenido anterior de resultados
  divResultados.innerHTML = "";

  if (textoBuscado === "") {
    return; // Si no hay texto, no se muestra la lista desplegable
  }

  // Filtro ejercicios que coincidan con el texto buscado
  const coincidencias = bd.ejerciciosBD.filter((ejercicio) =>
    ejercicio.nombre.toUpperCase().includes(textoBuscado)
  );

  // Creo y muestro la lista de coincidencias
  if (coincidencias.length > 0) {
    const listaCoincidencias = document.createElement("ul");
    listaCoincidencias.classList.add("ulEjercicios");

    coincidencias.forEach((ejercicio) => {
      const itemLista = document.createElement("li");
      itemLista.classList.add("liEjercicios");
      itemLista.textContent = ejercicio.nombre;
      itemLista.addEventListener("click", () => {
        // Cuando se hace clic en un elemento de la lista, se completa el valor en el input
        inputBuscar.value = ejercicio.nombre;
        // Limpio la lista de resultados
        divResultados.innerHTML = "";
      });
      listaCoincidencias.appendChild(itemLista);
    });

    divResultados.appendChild(listaCoincidencias);
  }
});

//Guardo lo que estoy confeccionando en el localStorage

// Obtengo el botón para  para eliminar rutina de la pantalla también

const btnBorrarRutina = document.querySelector("#btnBorrarRutina");

// Obtengo el contenido de la rutina que deseas guardar
const rutina = document.querySelector("#rutina");

//Botón para borrar datos del localStorage
btnBorrarRutina.addEventListener("click", function () {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás recuperar lo trabajado!",
    icon: "warning",
    iconColor: "red",
    color: "white",
    showCancelButton: true,
    confirmButtonColor: "#000000",
    cancelButtonColor: "#af0909",
    customClass: {
      popup: `backgroundSweetAlert`,
      confirmButton: `button`,
      cancelButton: `button`,
    },
    confirmButtonText: "Aceptar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("rutinaEjercicios");
      Swal.fire({
        title: "Deleted!",
        text: "Se ha borrado la rutina.",
        color: "white",
        icon: "success",
        iconColor: "red",

        confirmButtonColor: "#000000",
        customClass: {
          confirmButton: `button`,
          popup: `backgroundSweetAlert`,
        },
      });
      seccionRutina.innerHTML = "";
    }
  });
});

const cargarAAlumno = document.querySelector("#cargarAAlumno");

cargarAAlumno.addEventListener("click", async () => {
  const { value: text } = await Swal.fire({
    title: "Ingrese nombre y apellido del alumno",
    iconHtml:
      '<img src="../img/alumno_nuevo.svg" class="icono" alt="una pesa armandose">',
    input: "text",
    inputPlaceholder: "EJEMPLO: ROBERTO GONZALEZ",

    color: "white",
    confirmButtonColor: "#000000",
    inputAutoFocus: "false",
    customClass: {
      confirmButton: `button`,
      popup: `backgroundSweetAlert`,
    },
  });

  if (text) {
    Swal.fire({
      iconHtml:
        '<img src="../img/biceps.png" class="icono" alt="una pesa armandose">',
      title: `Rutina guardada para: ${text}`,
      color: "white",
      confirmButtonColor: "#000000",
      customClass: {
        confirmButton: `button`,
        popup: `backgroundSweetAlert`,
      },
    });
    const rutinaHTML = rutina.innerHTML;
    localStorage.setItem(text, rutinaHTML);
    const existe = alumnos.find((alumno) => alumno === text);
    if (!existe) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({ emojis: ["💪"], emojiSize: 20 });
      alumnos.push(text);
      listadoAlumnos.innerHTML += `<option>${text}</option>`;
      Swal.fire({
        iconHtml:
          '<img src="../img/nuevo_alumno.gif" class="icono" alt="un colgante de premio">',
        title: `Nuevo Alumno, rutina guardada para ${text}`,
        color: "white",
        confirmButtonColor: "#000000",
        customClass: {
          confirmButton: `button`,
          popup: `backgroundSweetAlert`,
          icon: `icono`,
        },
      });
    }
    localStorage.setItem("LISTA ALUMNOS", JSON.stringify(alumnos));
  } else {
    Swal.fire({
      icon: `error`,
      title: `No ha ingresado ningún dato`,
      color: "white",
      confirmButtonColor: "#000000",
      customClass: {
        confirmButton: `button`,
        popup: `backgroundSweetAlert`,
      },
    });
  }
});

const cargarRutina = document.querySelector("#cargarRutina");

cargarRutina.addEventListener("click", async () => {
  const { value: text } = await Swal.fire({
    title: "Ingrese nombre y apellido del alumno",
    input: "text",
    color: "white",
    inputPlaceholder: "EJEMPLO: ROBERTO GONZALEZ",
    confirmButtonColor: "#000000",
    customClass: {
      confirmButton: `button`,
      icon: `icono`,
      popup: `backgroundSweetAlert`,
    },
  });
  const rutinaGuardada = localStorage.getItem(text);
  if (text) {
    // Verificar si hay una rutina previamente guardada
    if (rutinaGuardada) {
      // Establecer el contenido de la rutina con la rutina guardada
      rutina.innerHTML = rutinaGuardada;
    }
  } else {
    Swal.fire({
      icon: `error`,
      title: "No hay rutina guardada",
      color: "white",
      confirmButtonColor: "#000000",
      customClass: {
        confirmButton: `button`,
        popup: `backgroundSweetAlert`,
      },
    });
  }
});

//Visualizamos alumnos

const listadoAlumnos = document.querySelector("#listadoAlumnos");

for (const alumno of alumnos) {
  listadoAlumnos.innerHTML += `<option>${alumno}</option>`;
}

listadoAlumnos.addEventListener("click", (event) => {
  // Obtiene el valor de la opción seleccionada
  const opcionSeleccionada = event.target.value;
  const rutinaStorage = localStorage.getItem(opcionSeleccionada);

  // Muestra los datos relacionados en algún lugar de tu página
  rutina.innerHTML = rutinaStorage;
});

console.log(alumnos);

//Obtengo elemento para quitar alumnos
const btnQuitarAlumno = document.querySelector("#btnQuitarAlumno");

btnQuitarAlumno.addEventListener("click", async () => {
  const { value: text } = await Swal.fire({
    title: "Ingrese nombre y apellido del alumno",
    input: "text",
    color: "white",
    inputPlaceholder: "EJEMPLO: ROBERTO GONZALEZ",
    confirmButtonColor: "#000000",
    customClass: {
      confirmButton: `button`,
      popup: `backgroundSweetAlert`,
    },
  });
  const indice = alumnos.indexOf(text);
  console.log(indice);
  if (text) {
    alumnos.splice(indice, 1);
    console.log(alumnos);
    Swal.fire({
      icon: `success`,
      title: `${text} fue eliminado de la lista de alumnos`,
      color: "white",
      confirmButtonColor: "#000000",
      customClass: {
        confirmButton: `button`,
        popup: `backgroundSweetAlert`,
      },
    });
  } else {
    Swal.fire({
      icon: `error`,
      title: "No hay existe ese alumno",
      color: "white",
      confirmButtonColor: "#000000",
      customClass: {
        confirmButton: `button`,
        popup: `backgroundSweetAlert`,
      },
    });
  }
  localStorage.setItem("LISTA ALUMNOS", JSON.stringify(alumnos));
});
