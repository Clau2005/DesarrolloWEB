// Variables globales
let totalDia = 0;
let cantidadVentas = 0;
const META_DIARIA = 500;
let historialVentas = [];
let stockDisponible = 500;
let clientes = {}; // Almacena los clientes y sus compras

// Función para verificar si una cadena solo contiene letras y espacios
function esSoloLetras(str) {
    return /^[a-zA-Z\s]+$/.test(str);
}

// Función para determinar el nivel de cliente frecuente
function obtenerNivelCliente(dni) {
    let compras = clientes[dni] || 0;
    if (compras >= 6) return "VIP";
    if (compras >= 3) return "Frecuente";
    return "Nuevo";
}

// Función para registrar una venta
function registrarVenta() {
    if (stockDisponible <= 0) {
        alert("Disculpa, se acabó el stock, vuelva mañana.");
        return;
    }

    let dni = prompt("Ingrese el DNI del cliente:").trim();
    if (!dni || isNaN(dni) || dni.length !== 8) {
        alert("Ingrese un DNI válido de 8 dígitos.");
        return;
    }

    let nombreCliente = prompt("Ingrese el nombre del cliente:").trim();
    if (!nombreCliente || !esSoloLetras(nombreCliente)) {
        alert("El nombre del cliente no puede estar vacío y solo debe contener letras.");
        return;
    }

    let cantidad = parseInt(prompt(`Ingrese la cantidad de anticuchos vendidos (Stock disponible: ${stockDisponible}):`));
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > stockDisponible) {
        alert("Cantidad inválida.");
        return;
    }

    let precioUnitario = parseFloat(prompt("Ingrese el precio unitario del anticucho:"));
    if (isNaN(precioUnitario) || precioUnitario <= 0) {
        alert("Ingrese un precio válido.");
        return;
    }

    let totalVenta = cantidad * precioUnitario;
    let descuento = 0;
    let detalleDescuento = "Sin descuento";
    let hora = new Date().getHours();

    // Aplicar descuentos por cantidad y total de compra
    if (cantidad > 10) {
        descuento = 0.05;
        detalleDescuento = "5% por más de 10 anticuchos.";
    }
    if (totalVenta > 100) {
        descuento = 0.10;
        detalleDescuento = "10% por superar S/ 100.";
    }
    if (hora >= 18 && hora <= 20) {
        descuento = 0.10;
        detalleDescuento = "10% por Happy Hour (6pm - 8pm).";
    }
    if ((clientes[dni] || 0) % 5 === 4) {
        descuento = 1.0;
        detalleDescuento = "Compra #5 gratis!";
    }

    let montoDescuento = totalVenta * descuento;
    totalVenta -= montoDescuento;
    clientes[dni] = (clientes[dni] || 0) + 1;

    historialVentas.push({ dni, nombreCliente, cantidad, precioUnitario, totalVenta, descuento, detalleDescuento });
    totalDia += totalVenta;
    cantidadVentas++;
    stockDisponible -= cantidad;

    alert(`Venta registrada correctamente para ${nombreCliente} (Nivel: ${obtenerNivelCliente(dni)}).\nTotal: S/ ${totalVenta.toFixed(2)}\nDescuento: ${detalleDescuento}`);
    verResumen();
}

// Función para generar reporte en PDF
function generarReporte() {
    let contenido = "Resumen de Ventas:\n";
    historialVentas.forEach((venta, index) => {
        contenido += `Venta #${index + 1}: ${venta.nombreCliente} - S/ ${venta.totalVenta.toFixed(2)} (${venta.detalleDescuento})\n`;
    });
    contenido += `\nTotal del día: S/ ${totalDia.toFixed(2)}\nVentas: ${cantidadVentas}\nMeta diaria: ${totalDia >= META_DIARIA ? "Alcanzada" : "No alcanzada"}`;
    
    let blob = new Blob([contenido], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reporte_ventas.txt";
    a.click();
}

// Función para ver el resumen del día
function verResumen() {
    console.log(`Total del día: S/ ${totalDia.toFixed(2)} | Ventas: ${cantidadVentas} | Meta: ${totalDia >= META_DIARIA ? "Alcanzada" : "No alcanzada"}`);
}
