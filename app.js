const PRECIOS = {

  pechuga: 52,
  piernas: 12,
  ala: 5,
  huacal: 4,
  patas: 1.5,
  higado: 1.5,
  cabeza: 1,
  rabadilla: 3
};

let carrito = [];

let lat = null;
let lng = null;

// MENÚ
const menu =
document.getElementById("menu");

// cantidades temporales
let temp = {};

Object.keys(PRECIOS)
.forEach(i => temp[i] = 1);

// GENERAR CARDS
Object.keys(PRECIOS)
.forEach(item => {

  let extraMenu = "";

  // PECHUGA
  if(item === "pechuga"){

    extraMenu = `
      <select id="tipo-pechuga"
      class="select-tipo">

        <option value="Entera">
          Entera
        </option>

        <option value="Partida">
          Partida
        </option>

        <option value="Bisteck">
          Bisteck
        </option>

      </select>
    `;
  }

  // PIERNAS
  if(item === "piernas"){

    extraMenu = `
      <select id="tipo-piernas"
      class="select-tipo">

        <option value="Normal">
          Normal
        </option>

        <option value="Partidas">
          Partidas
        </option>

        <option value="Bisteck">
          Bisteck
        </option>

      </select>
    `;
  }

  menu.innerHTML += `

    <div class="card">

      <h3>${item}</h3>

      <p class="precio">
        $${PRECIOS[item]}
      </p>

      ${extraMenu}

      <div class="contador">

        <button
        onclick="menos('${item}')">
          -
        </button>

        <span id="cant-${item}">
          1
        </span>

        <button
        onclick="mas('${item}')">
          +
        </button>

      </div>

      <button
      class="btn-add"
      onclick="agregar('${item}')">

        Agregar 🛒

      </button>

    </div>
  `;
});

// ➕ SUMAR
function mas(i){

  temp[i]++;

  document.getElementById(
    "cant-" + i
  ).innerText = temp[i];
}

// ➖ RESTAR
function menos(i){

  if(temp[i] > 1){

    temp[i]--;

    document.getElementById(
      "cant-" + i
    ).innerText = temp[i];
  }
}

// 🛒 AGREGAR
function agregar(i){

  let tipo = "";

  // pechuga
  if(i === "pechuga"){

    tipo =
    document.getElementById(
      "tipo-pechuga"
    ).value;
  }

  // piernas
  if(i === "piernas"){

    tipo =
    document.getElementById(
      "tipo-piernas"
    ).value;
  }

  carrito.push({

    item:i,
    tipo:tipo,
    cantidad:temp[i],

    subtotal:
    temp[i] * PRECIOS[i]
  });

  render();
}

// 🧾 RENDER
function render(){

  let html = "";
  let total = 0;

  carrito.forEach((p,index)=>{

    total += p.subtotal;

    html += `

      <div class="item-carrito">

        <b>${p.item}</b>

        ${p.tipo
          ? "(" + p.tipo + ")"
          : ""
        }

        <br>

        Cantidad:
        ${p.cantidad}

        <br>

        Subtotal:
        $${p.subtotal}

        <br>

        <button
        class="btn-eliminar"
        onclick="eliminar(${index})">

          ❌ Eliminar

        </button>

      </div>
    `;
  });

  document.getElementById(
    "carrito"
  ).innerHTML = html;

  document.getElementById(
    "total"
  ).innerText = total;
}

// ❌ ELIMINAR
function eliminar(index){

  carrito.splice(index,1);

  render();
}

// 📍 USAR GPS
function usarUbicacion(){

  const estado =
  document.getElementById(
    "estado"
  );

  if(!navigator.geolocation){

    alert(
      "Tu navegador no soporta GPS"
    );

    return;
  }

  estado.innerText =
  "📡 Obteniendo ubicación...";

  navigator.geolocation
  .getCurrentPosition(

    (pos)=>{

      lat =
      pos.coords.latitude;

      lng =
      pos.coords.longitude;

      estado.innerText =
      "✅ Ubicación registrada";
    },

    ()=>{

      estado.innerText =
      "❌ No se pudo obtener ubicación";
    }
  );
}

// 🗺️ VER UBICACIÓN
function verUbicacion(){

  if(!lat || !lng){

    alert(
      "Primero usa tu ubicación"
    );

    return;
  }

  const url =
  `https://www.google.com/maps?q=${lat},${lng}`;

  window.open(url,"_blank");
}

// 📲 ENVIAR PEDIDO
function enviarPedido(){

  const whatsapp =
  document.getElementById(
    "whatsapp"
  ).value;

  if(carrito.length === 0){

    alert(
      "Agrega productos"
    );

    return;
  }

  if(!whatsapp){

    alert(
      "Escribe tu WhatsApp"
    );

    return;
  }

  if(!lat || !lng){

    alert(
      "Usa tu ubicación"
    );

    return;
  }

  let total =
  carrito.reduce(
    (a,b)=>a+b.subtotal,0
  );

  let ticket =
`🍗 PEDIDO POLLERÍA

`;

  carrito.forEach(p=>{

    ticket +=
`${p.item}
${p.tipo
  ? "(" + p.tipo + ")"
  : ""
}
x${p.cantidad}
= $${p.subtotal}

`;
  });

  ticket +=
`TOTAL: $${total}

📱 WhatsApp Cliente:
${whatsapp}

📍 Ubicación:
https://www.google.com/maps?q=${lat},${lng}
`;

  fetch(
    "http://localhost:3000/pedido",
    {
      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        ticket
      })
    }
  );

  alert(
    "✅ Pedido enviado correctamente"
  );
}
