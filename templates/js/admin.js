let isEditMode = false;

function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    const section = document.getElementById(id);
    if (section) section.classList.add("active");
    if (id === "menu") loadMenuItems();
}

async function loadMenuItems() {
    try {
        const res = await fetch("http://localhost:3000/menu");
        const data = await res.json();
        const tbody = document.getElementById("menuTableBody");
        tbody.innerHTML = "";
        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
    <td class="px-4 py-2">${item.id}</td>
    <td class="px-4 py-2"><img src="${item.image}" class="w-16 h-10 object-cover rounded" /></td>
    <td class="px-4 py-2">${item.name}</td>
    <td class="px-4 py-2 description-cell">${item.description}</td>
    <td class="px-4 py-2">$${item.price.toFixed(2)}</td>
    <td class="px-4 py-2">${item.category || '-'}</td>
    <td class="px-4 py-2 flex flex-wrap gap-2">
    <button class="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 mr-2" onclick='openEditForm(${JSON.stringify(item)})'>Edit</button>
    <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteMenuItem('${item.id}')">Delete</button>
    </td>
`;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error loading menu:", err);
    }
}

function logoutAndRedirect() {
    localStorage.removeItem("token");
    window.location.href = "home.html";
}

function openAddForm() {
    isEditMode = false;
    currentEditId = null;
    document.getElementById("modalTitle").textContent = "Add Menu Item";
    document.getElementById("modalSubmitBtn").textContent = "Add Item";
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "coffee";
    document.getElementById("menuModal").classList.remove("hidden");
}

function openEditForm(item) {
    isEditMode = true;
    currentEditId = item.id;
    document.getElementById("modalTitle").textContent = "Edit Menu Item";
    document.getElementById("modalSubmitBtn").textContent = "Update";
    document.getElementById("name").value = item.name;
    document.getElementById("description").value = item.description;
    document.getElementById("price").value = item.price;
    document.getElementById("image").value = item.image || "img/slogan.png";
    document.getElementById("category").value = item.category || "other";
    document.getElementById("menuModal").classList.remove("hidden");
}


function closeModal() {
    document.getElementById("menuModal").classList.add("hidden");
}
window.onload = function () {
    loadMenuItems();
    document.getElementById("menuForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = parseFloat(document.getElementById("price").value.trim());
        let image = document.getElementById("image").value.trim();
        if (!image) {
            image = "img/slogan.png";
        }

        const category = document.getElementById("category").value.trim();
        const token = localStorage.getItem("token");

        if (!name || !description || isNaN(price)) {
            return alert("Please fill all fields correctly.");
        }

        const payload = { name, description, price, image, category };

        const url = isEditMode ? `http://localhost:3000/menu/${currentEditId}` : "http://localhost:3000/menu";

        const method = isEditMode ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            loadMenuItems();
            showSection('menu')
        } else {
            alert(`${isEditMode ? "Update" : "Add"} failed.`);
        }
    });
};

async function deleteMenuItem(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(`http://localhost:3000/menu/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
        loadMenuItems();
        showSection('menu');
    }

}