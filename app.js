const PRECIOS = {
  pechuga: 52,
  piernas: 12,
  ala: 5,
  huacal: 4,
  patas: 1.5,
  higado: 1.5,
  cabeza: 1
};

let carrito = [];

let lat = null;
let lng = null;

// 🍗 MENÚ
const menu = document.getElementById("menu");

Object.keys(PRECIOS).forEach(item => {
  menu.innerHTML += `
    <div class="card">
      <h3>${item}</h3>
      <p class="precio">$${PRECIOS[item]}</p>

      <div class="contador">
        <button onclick="menos('${item}')">-</button>
        <span id="cant-${item}">1</span>
        <button onclick="mas('${item}')">+</button>
      </div>

      <button class="btn-add" onclick="agregar('${item}')">
        Agregar
      </button>
    </div>
  `;
});

let temp = {};
Object.keys(PRECIOS).forEach(i => temp[i] = 1);

function mas(i){
  temp[i]++;
  document.getElementById("cant-"+i).innerText = temp[i];
}

function menos(i){
  if(temp[i]>1){
    temp[i]--;
    document.getElementById("cant-"+i).innerText = temp[i];
  }
}

function agregar(i){
  carrito.push({
    item:i,
    cantidad:temp[i],
    subtotal:temp[i]*PRECIOS[i]
  });
  render();
}

function render(){
  let html="";
  let total=0;

  carrito.forEach(p=>{
    total+=p.subtotal;
    html+=`${p.item} x${p.cantidad} = $${p.subtotal}<br>`;
  });

  document.getElementById("carrito").innerHTML = html;
  document.getElementById("total").innerText = total;
}

// 📍 SOLO UBICACIÓN ACTUAL
function usarUbicacion(){

  const estado = document.getElementById("estado");

  if(!navigator.geolocation){
    alert("Tu navegador no soporta GPS");
    return;
  }

  estado.innerText = "📡 Obteniendo ubicación...";

  navigator.geolocation.getCurrentPosition(
    (pos)=>{

      lat = pos.coords.latitude;
      lng = pos.coords.longitude;

      estado.innerText = "✅ Ubicación registrada";

    },
    ()=>{
      estado.innerText = "❌ No se pudo obtener ubicación";
    }
  );
}

// 📲 ENVIAR PEDIDO
function enviarPedido(){

  const whatsapp = document.getElementById("whatsapp").value;

  if(!whatsapp) return alert("Escribe tu WhatsApp");
  if(!lat || !lng) return alert("Usa tu ubicación");

  let total = carrito.reduce((a,b)=>a+b.subtotal,0);

  let ticket="🍗 PEDIDO POLLERÍA\n\n";

  carrito.forEach(p=>{
    ticket+=`${p.item} x${p.cantidad} = $${p.subtotal}\n`;
  });

  ticket+=`
TOTAL: $${total}

📱 WhatsApp cliente:
${whatsapp}

📍 Ubicación:
https://www.google.com/maps?q=${lat},${lng}
`;

  fetch("http://localhost:3000/pedido",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ticket})
  });

  alert("Pedido enviado 📲");
}