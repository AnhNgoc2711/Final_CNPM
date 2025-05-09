const API_URL = "http://localhost:3000";

async function fetchMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const menu = await response.json();

        const coffeeList = document.getElementById("coffee-list");
        const teaList = document.getElementById("tea-list");
        const matchaList = document.getElementById("matcha-list");

        menu.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6 mb-4";
            col.innerHTML = `
            <div class="menu-card h-100 shadow-lg">
                <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 220px; object-fit: cover;">
                <div class="menu-card-body d-flex flex-column">
                <h5 class="card-title font-weight-bold" style="font-size:1.3rem;font-family:'Noto Serif'; color: #3d2700;">${item.name}</h5>
                <p class="card-text font-italic" style="flex-grow: 1;">${item.description}</p>
                <div class="price mb-2">$${item.price.toFixed(2)}</div>
                <button class="btn btn-primary w-100 mt-auto" style="background-color: #3d2700;" onclick="orderItem('${item.id}')">
                    Order
                </button>
                </div>
            </div>`

            if (item.category === "coffee") coffeeList.appendChild(col);
            else if (item.category === "tea") teaList.appendChild(col);
            else if (item.category === "matcha") matchaList.appendChild(col);
        });
    } catch (err) {
        console.error("Error:", err);
    }
}


function orderItem(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login to place an order!");
        return;
    }
    window.location.href = `order.html?id=${id}`;
}


function scrollToHashAfterLoad() {
    const targetId = window.location.hash?.substring(1);
    if (!targetId) return;

    const el = document.getElementById(targetId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
}
function updateNavbar() {
    const token = localStorage.getItem("token");
    const loginNav = document.getElementById("login-nav");
    const accountDropdown = document.getElementById("account-dropdown");
    const actionItem = document.getElementById("nav-action-1");

    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        loginNav.classList.add("d-none");
        accountDropdown.classList.remove("d-none");

        if (payload.role === "admin") {
            actionItem.innerHTML = '<i class="bi bi-gear me-2"></i>Setting';
            actionItem.href = "admin.html";

            const roleLabel = document.getElementById("user-role");
            if (roleLabel) {
                roleLabel.classList.remove("d-none");
                roleLabel.textContent = "Admin";
            }
        } else {
            actionItem.innerHTML = '<i class="bi bi-cart3 me-2"></i>My Cart';
            actionItem.href = "my_order.html";
        }
    } else {
        loginNav.classList.remove("d-none");
        accountDropdown.classList.add("d-none");
    }
}
function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", async () => {
    updateNavbar();
    await fetchMenu();
    scrollToHashAfterLoad();
});

let menuItems = [];
        
function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

function updateDropdown(keyword) {
    keyword = removeVietnameseTones(keyword.toLowerCase());
    const dropdown = document.getElementById("searchDropdown");
    dropdown.innerHTML = "";

    const matches = menuItems.filter(item => {
        const name = removeVietnameseTones(item.name.toLowerCase());
        const description = removeVietnameseTones(item.description.toLowerCase());
        return name.includes(keyword) || description.includes(keyword);
    });

    if (!keyword || matches.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    matches.forEach(item => {
        const div = document.createElement("div");
        div.className = "dropdown-item-result";
        div.onclick = () => orderItem(item.id);
        div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
            <div class="fw-semibold">${item.name}</div>
            <div class="text-muted small">$${item.price.toFixed(2)}</div>
        </div>
    `;
        dropdown.appendChild(div);
    });

    dropdown.style.display = "block";
}


document.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_URL}/menu`)
        .then(res => res.json())
        .then(data => {
            menuItems = data;
        });

    document.getElementById("searchBox").addEventListener("input", (e) => {
        updateDropdown(e.target.value);
    });
});