const API_URL = "http://localhost:3000";

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));

        window.location.href = "home.html";
    } else {
        document.getElementById("error-message").classList.remove("d-none");
    }
}


const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("signup") === "success") {
    const message = document.createElement("p");
    message.className = "text-success mt-2";
    message.innerText = "Account created successfully! Please log in.";
    const loginCard = document.querySelector(".login-card");
    loginCard.insertBefore(message, loginCard.firstChild);
}