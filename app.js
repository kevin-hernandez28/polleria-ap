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

const menu =
document.getElementById("menu");

let temp = {};

Object.keys(PRECIOS)
.forEach(i=>temp[i]=1);

/* CREAR PRODUCTOS */

Object.keys(PRECIOS)
.forEach(item=>{

  let extra = "";

  /* PECHUGA */

  if(item==="pechuga"){

    extra = `
      <select
      id="tipo-pechuga"
      class="select-tipo">

        <option>Entera</option>
        <option>Partida</option>
        <option>Bisteck</option>

      </select>
    `;
  }

  /* PIERNAS */

  if(item==="piernas"){

    extra = `
      <select
      id="tipo-piernas"
      class="select-tipo">

        <option>Normal</option>
        <option>Partidas</option>
        <option>Bisteck</option>

      </select>
    `;
  }

  menu.innerHTML += `

    <div class="card">

      <div class="card-content">

        <h3>
          🍗 ${item}
        </h3>

        <p class="precio">

          $${PRECIOS[item]}

          <span class="pieza">
            por pieza
          </span>

        </p>

        ${extra}

        <!-- CONTADOR -->

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

        <!-- BOTON -->

        <button
        class="btn-add"
        onclick="agregar('${item}')">

          🛒 Agregar al carrito

        </button>

      </div>

    </div>
  `;
});

/* SUMAR */

function mas(i){

  temp[i]++;

  document.getElementById(
    "cant-"+i
  ).innerText=temp[i];
}

/* RESTAR */

function menos(i){

  if(temp[i]>1){

    temp[i]--;

    document.getElementById(
      "cant-"+i
    ).innerText=temp[i];
  }
}

/* AGREGAR */

function agregar(i){

  let tipo = "";

  if(i==="pechuga"){

    tipo =
    document.getElementById(
      "tipo-pechuga"
    ).value;
  }

  if(i==="piernas"){

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
    temp[i]*PRECIOS[i]
  });

  render();
}

/* RENDER */

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

        ${p.tipo
          ? `<p>
          🔪 Corte:
          ${p.tipo}
          </p>`
          : ""
        }

        <p>
          🔢 Cantidad:
          ${p.cantidad}
        </p>

        <p>
          💵 Subtotal:
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
  ).innerHTML=html;

  document.getElementById(
    "total"
  ).innerText=total;
}

/* ELIMINAR */

function eliminar(index){

  carrito.splice(index,1);

  render();
}

/* UBICACION */

function usarUbicacion(){

  const estado =
  document.getElementById(
    "estado"
  );

  if(!navigator.geolocation){

    alert(
      "GPS no soportado"
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

/* VER MAPA */

function verUbicacion(){

  if(!lat || !lng){

    alert(
      "Primero usa tu ubicación"
    );

    return;
  }

  window.open(
  `https://www.google.com/maps?q=${lat},${lng}`,
  "_blank");
}

/* ENVIAR */

function enviarPedido(){

  const whatsapp =
  document.getElementById(
    "whatsapp"
  ).value;

  if(carrito.length===0){

    alert(
      "Agrega productos"
    );

    return;
  }

  if(!whatsapp){

    alert(
      "Ingresa tu WhatsApp"
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
`🍗 *NUEVO PEDIDO - POLLERÍA ELI*%0A
━━━━━━━━━━━━━━━%0A%0A`;

  carrito.forEach(p=>{

    ticket +=
`📦 *Producto:* ${p.item}%0A
${p.tipo ? `🔪 Corte: ${p.tipo}%0A` : ""}
🔢 Cantidad: ${p.cantidad}%0A
💵 Subtotal: $${p.subtotal}%0A%0A`;
  });

  ticket +=
`━━━━━━━━━━━━━━━%0A
💰 *TOTAL:* $${total}%0A%0A

📱 *Cliente:*%0A
${whatsapp}%0A%0A

📍 *Ubicación:*%0A
https://www.google.com/maps?q=${lat},${lng}
`;

  const numero =
  "522281807458";

  window.open(
`https://wa.me/${numero}?text=${ticket}`,
"_blank");
}
