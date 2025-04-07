const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const orderList = document.getElementById("order-list");

// 從 localStorage 讀取商品資料
let products = JSON.parse(localStorage.getItem("products")) || [];

// 新增商品
productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const productName = document.getElementById("product-name").value.trim();
  const productPrice = parseInt(document.getElementById("product-price").value);
  const productImage = document.getElementById("product-image").files[0];

  if (!productName || isNaN(productPrice) || !productImage) {
    alert("請完整填寫所有欄位！");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(productImage);
  reader.onload = () => {
    const newProduct = {
      name: productName,
      price: productPrice,
      image: reader.result
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products)); // 儲存商品至 localStorage

    displayProducts(); // 更新後台商品顯示
    productForm.reset(); // 清空表單
  };
});

// 顯示商品
function displayProducts() {
  productList.innerHTML = ""; // 清空商品列表
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${product.image}" width="50">
      ${product.name} - NT$${product.price}
      <button class="delete-btn" data-index="${index}">刪除</button>
    `;
    productList.appendChild(li);
  });

  // 綁定刪除按鈕
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products)); // 更新 localStorage
      displayProducts(); // 刷新商品列表
    });
  });
}

// 顯示訂單
function displayOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orderList.innerHTML = ""; // 清空訂單列表

  orders.forEach((order, index) => {
    const li = document.createElement("li");
    let summary = `訂單 ${index + 1} - 總金額: NT$${order.totalPrice}\n時間: ${order.time}\n商品:\n`;
    order.items.forEach((item, i) => {
      summary += `  ${i + 1}. ${item.name} - NT$${item.price}\n`;
    });
    li.textContent = summary;
    orderList.appendChild(li);
  });
}

// 初始化
displayProducts();
displayOrders();