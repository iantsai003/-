const productContainer = document.getElementById("product-container");
const cartItems = document.getElementById("cart-items");
const totalPriceDisplay = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;

// 顯示商品
function displayProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  productContainer.innerHTML = ""; // 清空商品容器

  products.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="150">
      <h2>${product.name}</h2>
      <p>NT$${product.price}</p>
      <label for="quantity-${index}">數量：</label>
      <input type="number" id="quantity-${index}" class="quantity-input" min="1" value="1">
      <button class="buy-btn" data-index="${index}">加入購物車</button>
    `;
    productContainer.appendChild(productDiv);
  });

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productIndex = btn.getAttribute("data-index");
      const quantityInput = document.getElementById(`quantity-${productIndex}`);
      const quantity = parseInt(quantityInput.value);

      if (isNaN(quantity) || quantity <= 0) {
        alert("請輸入有效的數量！");
        return;
      }

      addToCart(products[productIndex], quantity); // 添加商品及數量到購物車
    });
  });
}

// 加入購物車
function addToCart(product, quantity) {
  const existingProductIndex = cart.findIndex((item) => item.name === product.name);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantity; // 更新數量
    cart[existingProductIndex].subtotal += product.price * quantity; // 更新小計
  } else {
    const cartItem = {
      name: product.name,
      price: product.price,
      quantity: quantity, // 添加數量
      subtotal: product.price * quantity // 計算小計
    };
    cart.push(cartItem);
  }

  totalPrice += product.price * quantity; // 更新總金額
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
  updateCart(); // 更新購物車顯示
}

// 更新購物車顯示
function updateCart() {
  cartItems.innerHTML = ""; // 清空購物車列表

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - NT$${item.price} x ${item.quantity} = NT$${item.subtotal}
      <button class="remove-btn" data-index="${index}">移除</button>
    `;
    cartItems.appendChild(li);
  });

  // 綁定移除按鈕
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      totalPrice -= cart[index].subtotal; // 更新總金額
      cart.splice(index, 1); // 移除商品
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
      updateCart(); // 重新顯示購物車
    });
  });

  totalPriceDisplay.textContent = totalPrice; // 顯示總金額
}

// 結帳功能
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("購物車是空的，請添加商品！");
    return;
  }

  const order = {
    items: cart,
    totalPrice: totalPrice,
    time: new Date().toLocaleString() // 記錄結帳時間
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert(`訂單已提交！\n總金額: NT$${order.totalPrice}\n下單時間: ${order.time}`);

  // 清空購物車
  cart = [];
  totalPrice = 0;
  localStorage.removeItem("cart");
  localStorage.removeItem("totalPrice");
  updateCart(); // 重置購物車顯示
});

// 初始化頁面
displayProducts();
updateCart();