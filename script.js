

const products = [
    {
        id: 1,
        name: "White Oudh",
        category: "Unisex",
        description: "A captivating blend of bright citrus and delicate fruity florals, softened by a warm, rich base. Subtle herbal nuances and smooth musk create an elegant fragrance with a distinctive amber and tobacco finish.",
        profile: "Citrus, fruity, floral, woody and musky.",
        occasion: "Everyday wear, relaxed evenings and occasions where understated sophistication is called for.",
        image: "images/white-oudh.jpg"
    },
    {
        id: 2,
        name: "Invista",
        category: "Men",
        description: "An invigorating aquatic fragrance that opens with refreshing citrus before revealing crisp marine accords. Warm woody undertones create a confident, energetic scent.",
        profile: "Fresh, aquatic, citrus, woody and amber.",
        occasion: "Daily wear, the office, casual outings and warm-weather occasions.",
        image: "images/invista.jpg"
    },
    {
        id: 3,
        name: "Azz Wanted",
        category: "Men",
        description: "A vibrant composition of sparkling citrus and aromatic spice, balanced by the earthy elegance of vetiver. Bold yet refined, it leaves a warm, woody impression.",
        profile: "Citrus, spicy, aromatic and woody.",
        occasion: "Everyday wear, social occasions, evenings and making a confident impression.",
        image: "images/azz-wanted.jpg"
    },
    {
        id: 4,
        name: "Berri Berri",
        category: "Women",
        description: "A deliciously fruity and feminine fragrance bursting with juicy red berries and blackcurrant. Delicate floral notes bring softness, while warm amber, musk and smooth woods create a beautifully rounded finish.",
        profile: "Fruity, sweet, floral, musky and woody.",
        occasion: "Everyday wear, brunches, dates and special occasions.",
        image: "images/berri-berri.jpg"
    }
];


const WHATSAPP_NUMBER = "27823197873";
const PRICE = 100;

let cart = JSON.parse(localStorage.getItem("fragranceCart")) || [];

function displayProducts(category = "All") {
    const filtered = category === "All"
        ? products
        : products.filter(product => product.category === category);

    document.getElementById("product-grid").innerHTML =
        filtered.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <span>${product.category}</span>
                    <img class="bottle" src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                   <div class="product-bottom">
    <strong>R${PRICE}</strong>
    <button onclick="addToCart(${product.id})">
        ADD TO BAG
    </button>
</div>

<button class="view-fragrance"
    onclick="window.location.href='product.html?id=${product.id}'">
    VIEW FRAGRANCE
</button>
                </div>
            </div>
        `).join("");
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    updateCart();
}


function updateCart() {
    localStorage.setItem("fragranceCart", JSON.stringify(cart));
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const floatingCount = document.getElementById("floating-cart-count");

if (floatingCount) {
    floatingCount.textContent = count;
}

    const cartButton = document.querySelector(".cart");
    if (cartButton) {
        cartButton.textContent = `Bag (${count})`;
    }

    const itemsContainer = document.getElementById("cart-items");

    if (!itemsContainer) return;

    itemsContainer.innerHTML = cart.length
        ? cart.map(item => {
            const product = products.find(p => p.id === item.id);

            return `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong>
                        <p>R${PRICE} each</p>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                        <button onclick="removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            `;
        }).join("")
        : "<p>Your shopping bag is empty.</p>";

    const total = cart.reduce(
        (sum, item) => sum + item.quantity * PRICE, 0
    );

    document.getElementById("cart-total").textContent = total;
}


function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function openCart() {
    document.getElementById("cart-modal").style.display = "flex";
    updateCart();
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

function checkout() {
    if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const notes = document.getElementById("order-notes").value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    const lines = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return `${product.name} x ${item.quantity} = R${item.quantity * PRICE}`;
    });

    const total = cart.reduce((sum, item) => sum + item.quantity * PRICE, 0);

    const message =
        `Hello! I'd like to place an order.\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n\n` +
        lines.join("\n") +
        `\n\nTotal: R${total}` +
        `\nOrder notes: ${notes || "None"}` +
        `\n\nPlease confirm my order.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

   

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")?.classList.remove("active");
        button.classList.add("active");
        displayProducts(button.dataset.category);
    });
});

function displayProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const product = products.find(p => p.id === id);

    if (!product) {
        document.querySelector(".product-detail-info").innerHTML =
            "<h1>Fragrance not found</h1><a href='index.html#shop'>Back to collection</a>";
        return;
    }

    document.getElementById("detail-image").src = product.image;
    document.getElementById("detail-image").alt = product.name;
    document.getElementById("detail-category").textContent = product.category;
    document.getElementById("detail-name").textContent = product.name;
    document.getElementById("detail-price").textContent = `R${PRICE}`;
    document.getElementById("detail-description").textContent = product.description;
    document.getElementById("detail-profile").textContent = product.profile;
document.getElementById("detail-occasion").textContent = product.occasion;

    document.getElementById("detail-add-button").onclick = () => {
        addToCart(product.id);
        alert(`${product.name} added to your bag!`);
    };
}


if (document.getElementById("product-grid")) {
    displayProducts();
}

updateCart();

if (window.location.pathname.endsWith("product.html")) {
    displayProductDetails();
}

