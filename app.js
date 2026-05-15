const PRECIOS = {

  pechuga:52,
  piernas:12,
  ala:5,
  huacal:4,
  patas:1.5,
  higado:1.5,
  cabeza:1,
  rabadilla:3
};

const IMAGENES = {

  pechuga:
  "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop",

  piernas:
  "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop",

  ala:
  "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop",

  huacal:
  "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800&auto=format&fit=crop",

  patas:
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop",

  higado:
  "https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=800&auto=format&fit=crop",

  cabeza:
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",

  rabadilla:
  "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop"
};

let carrito = [];

let lat = null;
let lng = null;

const menu =
document.getElementById("menu");

let temp = {};

Object.keys(PRECIOS)
.forEach(i=>temp[i]=1);

/* CREAR CARDS */

Object.keys(PRECIOS)
.forEach(item=>{

  let extra = "";

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

      <img src="${IMAGENES[item]}">

      <div class="card-content">

        <h3>${item}</h3>

        <p class="precio">
          $${PRECIOS[item]}
        </p>

        ${extra}

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

        <b>${p.item}</b>

        ${p.tipo
          ? "(" + p.tipo + ")"
          : ""
        }

        <br><br>

        🔢 Cantidad:
        ${p.cantidad}

        <br><br>

        💵 Subtotal:
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

/* GPS */

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
    "_blank"
  );
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
`*🍗 NUEVO PEDIDO - POLLERÍA ELI*%0A
=========================%0A%0A`;

  carrito.forEach(p=>{

    ticket +=
`➡️ Producto: ${p.item}%0A
${p.tipo ? `🔪 Corte: ${p.tipo}%0A` : ""}
🔢 Cantidad: ${p.cantidad}%0A
💵 Subtotal: $${p.subtotal}%0A%0A`;
  });

  ticket +=
`=========================%0A
💰 TOTAL: $${total}%0A%0A

📱 WhatsApp del cliente:%0A
${whatsapp}%0A%0A

📍 Ubicación del cliente:%0A
https://www.google.com/maps?q=${lat},${lng}
`;

  const numero =
  "522281807458";

  window.open(
`https://wa.me/${numero}?text=${ticket}`,
"_blank"
  );
}
