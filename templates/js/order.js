document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = new URLSearchParams(window.location.search).get("id");
    const reviewText = document.getElementById("review-text");
    const submitReview = document.getElementById("submit-review");
    const reviewsList = document.getElementById("reviews-list");
    const stars = document.querySelectorAll(".star");


    if (!productId) {
        alert("No product selected!");
        return;
    }
    const response = await fetch("http://localhost:3000/menu");
    const menuItems = await response.json();
    const product = menuItems.find(item => item.id == productId);

    if (!product) {
        alert("Product not found!");
        return;
    }

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = product.price.toFixed(2);


    const quantityInput = document.getElementById("quantity");
    const totalPriceElement = document.getElementById("total-price");


    function updateTotalPrice() {
        let quantity = parseInt(quantityInput.value);
        let totalPrice = product.price * quantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    quantityInput.addEventListener("input", updateTotalPrice);
    updateTotalPrice();

    document.getElementById("add-to-cart").addEventListener("click", function () {
        let quantity = parseInt(document.getElementById("quantity").value);
        let size = document.getElementById("size").value;
        let sugar = document.getElementById("sugar").value;
        let ice = document.getElementById("ice").value;
        let note = document.getElementById("order-note").value.trim();

        let orders = JSON.parse(localStorage.getItem("orders")) || [];

        let found = orders.find(order =>
            order.id === product.id &&
            order.size === size &&
            order.sugar === sugar &&
            order.ice === ice &&
            order.note === note
        );

        if (found) {
            found.quantity += quantity;
        } else {

            orders.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: size,
                sugar: sugar,
                ice: ice,
                note: note
            });
        }

        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart");
        setTimeout(() => {
            window.location.href = "my_order.html";
        }, 200);
    });


    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add("active");
            }
        });
    });

    submitReview.addEventListener("click", function () {
        if (selectedRating === 0) {
            alert("Please select a star rating!");
            return;
        }

        const review = {
            rating: selectedRating,
            text: reviewText.value,
            date: new Date().toLocaleDateString()
        };

        let reviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
        reviews.push(review);
        localStorage.setItem(`reviews-${productId}`, JSON.stringify(reviews));

        reviewText.value = "";
        selectedRating = 0;
        stars.forEach(s => s.classList.remove("active"));
        displayReviews();
    });


    function displayReviews() {
        let reviews = JSON.parse(localStorage.getItem(`reviews-${productId}`)) || [];
        reviewsList.innerHTML = reviews.map(review => `
    <div class="review-item">
        <p>${"⭐".repeat(review.rating)}</p>
        <p>${review.text}</p>
        <small>${review.date}</small>
    </div>
`).join("");
    }

    displayReviews();
});