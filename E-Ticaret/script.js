var left = "[";
var right = "]";
var msg = "--- E-Ticaret Örnek ---";
var speed = 200;

function scroll_title() {
  document.title = left + msg + right;
  msg = msg.substring(1, msg.length) + msg.charAt(0);
  setTimeout("scroll_title()", speed);
}
scroll_title();

//Temel Değişkenler
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const categoryList = document.getElementById("categoryList");
const cartCount = document.getElementById("sepetMiktar");
const API_URL = "https://dummyjson.com/products";

var cart = [];

function addProductToCart(urun) {
  const cartItem = {
    id: urun.id,
    title: urun.title,
    price: urun.price,
    thumbnail: urun.thumbnail,
    quantity: 1,
  };

  for (const item of cart) {
    if (item.id === cartItem.id) {
      item.quantity++;

      updateCartCount();
      displayCart();
      return;
    }
  }

  //Ürünü sepete ekle
  cart.push(cartItem);
  updateCartCount();
  displayCart();
}

function updateCartCount() {
  var totalCount = 0;

  for (var item of cart) {
    totalCount += item.quantity;
  }

  cartCount.textContent = `(${totalCount})`;
}

function displayCart() {
  const sepetListesi = document.getElementById("sepetListesi");
  const toplamFiyat = document.getElementById("toplamFiyat");

  sepetListesi.innerHTML = "";

  if (cart.length === 0) {
    sepetListesi.innerHTML = `
    <div class="alert alert-danger" role="alert">
       Sepetinizde hiç ürün bulunmamaktadır :(
    </div>
    `;
    toplamFiyat.textContent = 0;
    return;
  }

  cart.map((item) => {
    const sepetNesnesi = document.createElement("div");
    sepetNesnesi.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );

    sepetNesnesi.innerHTML = `
    <div class="d-flex align-items-center">
      <img src=${item.thumbnail} alt=${item.title} width="100px" height="100px"/>
      <div class="ms-3" >
        <p>${item.title}</p>
        <p>Fiyat: ${item.price}</p>
        <p>Miktar: ${item.quantity}</p>
      </div>
    </div>
    <button class="btn btn-danger btn-remove-from-cart" data-id="${item.id}">Kaldır</button>
    
    `;

    sepetListesi.appendChild(sepetNesnesi);

    const removeButton = sepetNesnesi.querySelector(".btn-remove-from-cart");
    removeButton.addEventListener("click", () => {
      const silinecekId = parseInt(removeButton.getAttribute("data-id"));
      removeProductFromCart(silinecekId);
      displayCart();
    });
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  toplamFiyat.textContent = total;
}

document.getElementById("sepetButon").addEventListener("click", displayCart());

function removeProductFromCart(productId) {
  const indexNo = cart.findIndex((item) => item.id === productId);
  if (indexNo !== -1) {
    cart.splice(indexNo, 1);
    updateCartCount();
  }
}

var products = [];

function fetchProducts() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      products = data.products;
      displayProducts(products);
      displayCategories();
    });
}

function displayProducts(products) {
  productList.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "my-2");
    card.innerHTML = `
        <div class="card">
            <img src=${product.thumbnail} class="card-img-top img-fluid" alt=${product.title}/>
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.price} TL</p>
                <button class="btn btn-info btn-add-to-cart" data-id=${product.id}> SEPETE EKLE! </button>
            </div>
        </div>
    `;

    productList.appendChild(card);

    const addToCartButton = card.querySelector(".btn-add-to-cart");
    addToCartButton.addEventListener("click", () => {
      const productId = parseInt(addToCartButton.getAttribute("data-id"));
      const selectedProduct = products.find((p) => p.id === productId);

      addProductToCart(selectedProduct);
    });
  });
}

function displayCategories() {
  const categories = [];

  products.map((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }

    categoryList.innerHTML = "";

    categories.forEach((category) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = category;

      listItem.addEventListener("click", () => {
        const filteredProducts = products.filter(
          (x) => x.category === category
        );
        displayProducts(filteredProducts);
      });

      categoryList.appendChild(listItem);
    });
  });
}

searchButton.addEventListener("click", searchProducts);

function searchProducts() {
  const searchItem = searchInput.value.toLowerCase().trim();

  const searchedProducts = products.filter(
    (x) =>
      x.title.toLowerCase().includes(searchItem) ||
      x.description.includes(searchItem)
  );

  displayProducts(searchedProducts);
}

fetchProducts();
