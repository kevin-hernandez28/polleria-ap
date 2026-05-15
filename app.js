const PRECIOS = {

        <b>${p.item}</b>

        ${p.tipo
          ? '(' + p.tipo + ')'
          : ''
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
    'carrito'
  ).innerHTML = html;

  document.getElementById(
    'total'
  ).innerText = total;
}

// ELIMINAR
function eliminar(index){

  carrito.splice(index,1);

  render();
}

// UBICACIÓN
function usarUbicacion(){

  const estado =
  document.getElementById(
    'estado'
  );

  if(!navigator.geolocation){

    alert(
      'Tu navegador no soporta GPS'
    );

    return;
  }

  estado.innerText =
  '📡 Obteniendo ubicación.
