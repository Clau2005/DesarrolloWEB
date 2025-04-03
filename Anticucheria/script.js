let totalDia = 0;
let cantidadVentas = 0;
const META_DIARIA = 500;
let historialVentas = [];
let stockDisponible = 500;

function esSoloLetras(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

function registrarVenta() {
    let continuar = true;

    while (continuar) {
        if (stockDisponible <= 0) {
            alert("Disculpa, se acabó el stock, vuelva mañana.");
            return;
        }

        let nombreCliente = prompt("Ingrese el nombre del cliente:").trim();
        if (!nombreCliente || !esSoloLetras(nombreCliente)) {
            alert("El nombre del cliente no puede estar vacío y solo debe contener letras.");
            return;
        }

        let cantidad;
        while (true) {
            cantidad = prompt(`Ingrese la cantidad de anticuchos vendidos (Stock disponible: ${stockDisponible}):`);
            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Por favor, ingrese una cantidad válida (número positivo).");
            } else if (cantidad > stockDisponible) {
                alert(`No puede vender más de ${stockDisponible} anticuchos.`);
            } else {
                cantidad = parseInt(cantidad);
                break;
            }
        }

        let precioUnitario;
        while (true) {
            precioUnitario = prompt("Ingrese el precio unitario del anticucho:");
            if (isNaN(precioUnitario) || precioUnitario <= 0) {
                alert("Por favor, ingrese un precio válido (número positivo).");
            } else {
                precioUnitario = parseFloat(precioUnitario);
                break;
            }
        }

        let totalVenta = cantidad * precioUnitario;
        let descuento = 0;
        let detalleDescuento = "Sin descuento";

        if (cantidad > 10) {
            descuento = 0.05;
            detalleDescuento = "5% por más de 10 anticuchos.";
        }
        if (totalVenta > 100) {
            let descuentoTotal = 0.10;
            if (descuento < descuentoTotal) {
                descuento = descuentoTotal;
                detalleDescuento = "10% por superar S/ 100.";
            }
        }

        let montoDescuento = totalVenta * descuento;
        totalVenta -= montoDescuento;

        let confirmacion = confirm(`¿Está de acuerdo con los siguientes datos?\n
        Cliente: ${nombreCliente}\n
        Cantidad: ${cantidad}\n
        Precio Unitario: S/ ${precioUnitario.toFixed(2)}\n
        Total: S/ ${totalVenta.toFixed(2)}\n
        Descuento aplicado: ${detalleDescuento}`);

        if (confirmacion) {
            totalDia += totalVenta;
            cantidadVentas++;
            stockDisponible -= cantidad;

            historialVentas.push({
                cliente: nombreCliente,
                cantidad,
                precioUnitario,
                totalVenta,
                descuento,
                detalleDescuento
            });

            alert(`Venta registrada correctamente para ${nombreCliente}.
            Total de esta venta: S/ ${totalVenta.toFixed(2)}
            Descuento aplicado: ${detalleDescuento}`);
        } else {
            alert("Venta no registrada.");
        }

        verStock();
        continuar = confirm("¿Desea registrar otra venta?");
    }
}

function verResumen() {
    let mensaje = `
        <h3>Resumen del día:</h3>
        <p>- Total acumulado: S/ ${totalDia.toFixed(2)}</p>
        <p>- Número de ventas realizadas: ${cantidadVentas}</p>
        <p>- Meta diaria: ${totalDia >= META_DIARIA ? "ALCANZADA" : "NO ALCANZADA"}</p>
        <button onclick="ocultarElemento('result')">Minimizar</button>
    `;

    document.getElementById("result").innerHTML = mensaje;
}

function verBoletas() {
    let boletasHTML = "<h3>Boletas de Ventas:</h3>";

    if (historialVentas.length === 0) {
        boletasHTML += "<p>No hay ventas registradas aún.</p>";
    } else {
        historialVentas.forEach((venta, index) => {
            boletasHTML += `
                <div class="boleta">
                    <strong>Boleta #${index + 1}</strong><br>
                    Cliente: ${venta.cliente}<br>
                    Cantidad: ${venta.cantidad}<br>
                    Precio Unitario: S/ ${venta.precioUnitario.toFixed(2)}<br>
                    Total: S/ ${venta.totalVenta.toFixed(2)}<br>
                    Descuento Aplicado: ${venta.detalleDescuento}<br>
                    <hr>
                </div>
            `;
        });
    }

    boletasHTML += `<button onclick="ocultarElemento('boletas')">Minimizar</button>`;

    document.getElementById("boletas").innerHTML = boletasHTML;
}

function verStock() {
    let stockHTML = `
        <h3>Stock Disponible</h3>
        <table>
            <tr>
                <th>Producto</th>
                <th>Cantidad Disponible</th>
            </tr>
            <tr>
                <td>Anticuchos</td>
                <td>${stockDisponible}</td>
            </tr>
        </table>
    `;

    document.getElementById("stock").innerHTML = stockHTML;
}

// NUEVO: Función para ocultar elementos
function ocultarElemento(id) {
    document.getElementById(id).innerHTML = "";
}