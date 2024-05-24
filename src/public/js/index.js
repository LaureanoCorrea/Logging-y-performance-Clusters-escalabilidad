document.addEventListener("DOMContentLoaded", function () {
  const socket = io(); // configuración para poder usar socket del lado del cliente

  socket.emit("message1", "Conectado con websocket");

  // Función para agregar productos
  function addProduct() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price = document.getElementById("price").value;
    let thumbnail = document.getElementById("thumbnail").value;
    let code = document.getElementById("code").value;
    let stock = document.getElementById("stock").value;
    let status = document.getElementById("status").value;
    let category = document.getElementById("category").value;

    if (
      !title ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category ||
      !status
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios",
      });
      return false;
    }

    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };

    socket.emit("addProduct", product);
    document.getElementById("form_add").reset();
  }

  // Manejador para el chat
  const chatbox = document.getElementById("chatbox");
  if (chatbox) {
    chatbox.addEventListener("keyup", function (evt) {
      if (evt.key === "Enter") {
        if (chatbox.value.trim().length > 0) {
          socket.emit("message", { email, message: chatbox.value });
          chatbox.value = "";
        }
      }
    });
  }

  // Recibir lista de productos
  socket.on("productsList", (data) => {
    const productList = document.getElementById("productList");

    if (productList && Array.isArray(data)) {
      productList.innerHTML = "";

      const table = document.createElement("table");
      table.id = "product_table";
      table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Código</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

      data.forEach((product) => {
        const row = document.createElement("tr");
        row.id = `product_${product._id}`;
        row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>$${product.price}</td>
                <td>${product.code}</td>
                <td><button type="button" class="delete_button" onclick="borrarProducto('${product._id}')">X</button></td>
                <td><button type="button" class="edit_button" onclick="mostrarFormulario('${product._id}', '${product.quantity}')">Edit</button></td>
            `;
        table.querySelector("tbody").appendChild(row);
      });

      productList.appendChild(table);
    }
  });

  // Recibir mensajes del chat
  socket.on("messageLogs", (data) => {
    let messageLogs = document.querySelector("#messageLogs");
    let mensajes = "";
    data.forEach((mensaje) => {
      if (mensaje.email === email) {
        mensajes += `<p class="self-message"><strong>You:</strong> ${mensaje.message}</p>`;
      } else {
        mensajes += `<p class="other-message"><strong>${mensaje.email}:</strong> ${mensaje.message}</p>`;
      }
    });

    messageLogs.innerHTML = mensajes;
    messageLogs.scrollTop = messageLogs.scrollHeight;
  });

  // // Modal para ingresar el correo electrónico
  // Swal.fire({
  //   title: "Ingresa tu e-mail para poder continuar",
  //   input: "email",
  //   text: "Ingresa e-mail",
  //   inputValidator: (value) => {
  //     return !value && "Datos requeridos";
  //   },
  //   allowOutsideClick: false,
  // }).then((result) => {
  //   email = result.value;
  // });

  // Iniciar el cálculo del subtotal y configurar los botones del carrito
  calcularSubtotal();
  document
    .getElementById("vaciar_carrito_btn")
    .addEventListener("click", vaciarCarrito);
  document
    .getElementById("comprar_btn")
    .addEventListener("click", terminarCompra);

  // Configurar la actualización de cantidad de productos en el carrito
  const quantityInputs = document.querySelectorAll(".product_quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("input", function () {
      actualizarCantidadProducto(input.dataset.productId, input.textContent);
      calcularSubtotal();
    });
  });

  // Hacer las funciones globales para el uso en los eventos de los botones
  window.borrarProducto = borrarProducto;
  window.mostrarFormulario = mostrarFormulario;
});
