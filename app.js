const PRECIOS = {

  pechuga:52,
  piernas:12,
  ala:5,
  huacal:4,
  patas:1.50,
  higado:1.50,
  cabeza:1,
  rabadilla:2.50

};

let carrito = [];

let lat = null;
let lng = null;

/* =========================
   MENU
========================= */

const menu =
document.getElementById("menu");

/* =========================
   CANTIDADES
========================= */

let temp = {};

Object.keys(PRECIOS)
.forEach(i => temp[i] = 1);

/* =========================
   GENERAR PRODUCTOS
========================= */

Object.keys(PRECIOS)
.forEach(item => {

  let extraMenu = "";

  /* PECHUGA */

  if(item === "pechuga"){

    extraMenu = `

      <select
      id="tipo-pechuga"
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

  /* PIERNAS */

  if(item === "piernas"){

    extraMenu = `

      <select
      id="tipo-piernas"
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

  /* CARD */

  menu.innerHTML += `

    <div class="card">

      <div class="card-content">

        <h3>
          ${item}
        </h3>

        <p class="precio">

          $${PRECIOS[item]}

        </p>

        <p class="pieza">
          Precio por pieza
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

    </div>

  `;
});

/* =========================
   SUMAR
========================= */

function mas(i){

  temp[i]++;

  document.getElementById(
    "cant-" + i
  ).innerText = temp[i];
}

/* =========================
   RESTAR
========================= */

function menos(i){

  if(temp[i] > 1){

    temp[i]--;

    document.getElementById(
      "cant-" + i
    ).innerText = temp[i];
  }
}

/* =========================
   AGREGAR AL CARRITO
========================= */

function agregar(i){

  let tipo = "";

  /* PECHUGA */

  if(i === "pechuga"){

    tipo =
    document.getElementById(
      "tipo-pechuga"
    ).value;
  }

  /* PIERNAS */

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

/* =========================
   RENDER CARRITO
========================= */

function render(){

  let html = "";

  let total = 0;

  carrito.forEach((p,index)=>{

    total += p.subtotal;

    html += `

      <div class="item-carrito">

        <h3>
          🍗 ${p.item}
        </h3>

        ${
          p.tipo
          ?
          `<p>
            🔪 ${p.tipo}
          </p>`
          :
          ""
        }

        <p>

          🔢 Cantidad:
          ${p.cantidad}

        </p>

        <p>

          💰 Subtotal:
          $${p.subtotal}

        </p>

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

/* =========================
   ELIMINAR
========================= */

function eliminar(index){

  carrito.splice(index,1);

  render();
}

/* =========================
   GPS
========================= */

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

/* =========================
   VER UBICACION
========================= */

function verUbicacion(){

  if(!lat || !lng){

    alert(
      "Primero usa tu ubicación"
    );

    return;
  }

  const url =
  `https://www.google.com/maps?q=${lat},${lng}`;

  window.open(
    url,
    "_blank"
  );
}

/* =========================
   ENVIAR PEDIDO
========================= */

function enviarPedido(){

  const whatsapp =
  document.getElementById(
    "whatsapp"
  ).value;

  /* VALIDACIONES */

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

  /* TOTAL */

  let total =
  carrito.reduce(
    (a,b)=>a+b.subtotal,
    0
  );

  /* TICKET */

  let ticket =
`🍗 *NUEVO PEDIDO - POLLERÍA ELI*%0A
━━━━━━━━━━━━━━━%0A%0A`;

  carrito.forEach(p=>{

    ticket +=
`📦 *Producto:* ${p.item}%0A
${p.tipo ? `🔪 *Corte:* ${p.tipo}%0A` : ""}
🔢 *Cantidad:* ${p.cantidad}%0A
💰 *Subtotal:* $${p.subtotal}%0A%0A`;
  });

  ticket +=
`━━━━━━━━━━━━━━━%0A
💵 *TOTAL:* $${total}%0A%0A

📱 *WhatsApp Cliente:*%0A
${whatsapp}%0A%0A

📍 *Ubicación del cliente:*%0A
https://www.google.com/maps?q=${lat},${lng}%0A%0A

🚚 Pedido listo para entregar.
`;

  /* NUMERO DUEÑO */

  const numeroDueno =
  "522281807458";

  /* URL WHATSAPP */

  const url =
`https://wa.me/${numeroDueno}?text=${ticket}`;

  window.open(
    url,
    "_blank"
  );
}
