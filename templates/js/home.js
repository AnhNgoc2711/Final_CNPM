const API_URL = "http://localhost:3000";

async function book() {

    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to book a tabel.");
        return;
    }

    const name = document.getElementById("namef").value.trim();
    const email = document.getElementById("emailf").value.trim();
    const date = document.getElementById("datef").value.trim();
    const time = document.getElementById("timef").value.trim();
    const person = document.getElementById("numberf").value.trim();
    const tableType = document.getElementById("tableTypef").value.trim();


    if (!name || !email || !date || !time || !person || !tableType) {
        alert(" Please fill in all fields before booking.");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("⚠️ Please enter a valid email address.");
        return;
    }

    if (isNaN(person) || person <= 0) {
        alert("⚠️ Number of people must be greater than 0.");
        return;
    }

    const bookingDate = new Date(date);
    const bookingTime = new Date(`${date}T${time}`);

    const dayOfWeek = bookingDate.getDay();

    // Convert time to 24-hour format for easier comparison
    const hours = bookingTime.getHours();
    const minutes = bookingTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    let isValidTime = false;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Monday - Friday: 08:00 AM - 08:00 PM 
        if (timeInMinutes >= 480 && timeInMinutes <= 1200) {
            isValidTime = true;
        }
    } else {
        // Saturday - Sunday: 02:00 PM - 08:00 PM
        if (timeInMinutes >= 840 && timeInMinutes <= 1200) {
            isValidTime = true;
        }
    }

    if (!isValidTime) {
        alert("⚠️ Booking time is outside of working hours.\n\n🕒 Monday - Friday: 08:00 AM - 08:00 PM\n🕒 Saturday - Sunday: 02:00 PM - 08:00 PM");
        return;
    }

    localStorage.setItem("bookingName", name);
    localStorage.setItem("bookingEmail", email);
    localStorage.setItem("bookingDate", date);
    localStorage.setItem("bookingTime", time);
    localStorage.setItem("bookingPerson", person);
    localStorage.setItem("bookingTable", tableType);
    window.location.href = "booking.html";
};


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

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
        // Run your navbar initialization scripts
        updateNavbar();
        });
    });