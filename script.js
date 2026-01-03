/***********************
  INITIAL ADMIN PASSWORD
************************/
if (!localStorage.getItem("adminPassword")) {
  localStorage.setItem("adminPassword", "12345");
}

/***********************
  DATA
************************/
let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let selectedProduct = null;

/***********************
  LOAD PRODUCTS (HOME)
************************/
function loadProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  products.forEach((p, i) => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><b>₹${p.price}</b></p>
        <p style="font-size:14px;color:#555">${p.description}</p>
        <button type="button" onclick="openOrder(${i})">Buy Now</button>
      </div>
    `;
  });
}
loadProducts();

/***********************
  OPEN ORDER MODAL
************************/
function openOrder(index) {
  selectedProduct = products[index];

  document.getElementById("orderProductName").innerText =
    selectedProduct.name;

  document.getElementById("orderProductPrice").innerText =
    "Price: ₹" + selectedProduct.price;

  document.getElementById("orderProductDesc").innerText =
    selectedProduct.description;

  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

/***********************
  PLACE ORDER (WHATSAPP)
************************/
function placeOrder() {
  let name = document.getElementById("cname").value;
  let phone = document.getElementById("cphone").value;
  let size = document.getElementById("csize").value;
  let address = document.getElementById("caddress").value;

  if (!name || !phone || !size || !address) {
    alert("Please fill all details");
    return;
  }

  let order = {
    product: selectedProduct.name,
    price: selectedProduct.price,
    size: size,
    name: name,
    phone: phone,
    address: address,
    date: new Date().toLocaleString()
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  let message = `
🛒 *New Shoe Order*

👟 Product: ${order.product}
💰 Price: ₹${order.price}
📏 Size: ${order.size}

🙍 Name: ${order.name}
📞 Phone: ${order.phone}
🏠 Address: ${order.address}
`;

  let whatsappNumber = "919316842411"; // ← CHANGE NUMBER
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  closeModal();
}

/***********************
  ADMIN LOGIN
************************/
function adminLogin() {
  let pass = document.getElementById("adminPass").value;

  if (pass === localStorage.getItem("adminPassword")) {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin.html";
  } else {
    document.getElementById("loginError").innerText = "Wrong Password";
  }
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

/***********************
  ADD PRODUCT (ADMIN)
************************/
function addProduct() {
  let name = document.getElementById("pname").value;
  let price = document.getElementById("pprice").value;
  let image = document.getElementById("pimage").value;
  let desc = document.getElementById("pdesc").value;

  if (!name || !price || !image || !desc) {
    alert("Fill all product fields");
    return;
  }

  products.push({
    name: name,
    price: price,
    image: image,
    description: desc
  });

  localStorage.setItem("products", JSON.stringify(products));
  alert("Product Added Successfully");
  location.reload();
}

/***********************
  DELETE PRODUCT (ADMIN)
************************/
function deleteProduct(index) {
  if (confirm("Delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    location.reload();
  }
}

/***********************
  ADMIN PRODUCT LIST
************************/
if (document.getElementById("adminProducts")) {
  let box = document.getElementById("adminProducts");
  box.innerHTML = "";

  products.forEach((p, i) => {
    box.innerHTML += `
      <div style="background:#fff;padding:10px;margin:10px">
        <b>${p.name}</b> - ₹${p.price}<br>
        <button onclick="deleteProduct(${i})">Delete</button>
      </div>
    `;
  });
}

/***********************
  ORDER HISTORY (ADMIN)
************************/
if (document.getElementById("orders")) {
  let ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  orders.forEach((o, i) => {
    ordersDiv.innerHTML += `
      <div style="
        background:#111;
        color:#fff;
        padding:15px;
        margin:12px;
        border-radius:10px;
        box-shadow:0 0 10px rgba(0,0,0,0.4);
      ">
        <b style="font-size:16px">${o.product}</b> <br>
        💰 Price: ₹${o.price} <br>
        📏 Size: ${o.size} <br><br>

        👤 ${o.name} <br>
        📞 ${o.phone} <br>
        🏠 ${o.address} <br><br>

        🕒 ${o.date}
      </div>
    `;
  });
}

