const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(bodyParser.json());

let users = require("./user.js");
let menu = require("./menu.js");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        req.user = user;
        next();
    });
}

/* GET - Get all menu items */
app.get("/menu", (req, res) => {
    res.json(menu);
});

/* GET - Get all user */
app.get('/user', (req, res) => {
    res.json(users);
});

app.get("/orders", (req, res) => {
    res.json(orders);
});


/* POST - Login */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});


/* POST - Signup */
app.post("/signup", (req, res) => {
    const { username, password, role } = req.body;

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = { username, password, role: role || "user" };
    users.push(newUser);

    // Rewrite to user.js 
    const jsCode = `const users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;\n`;
    fs.writeFileSync("./user.js", jsCode);

    res.status(201).json({ message: "User registered successfully!" });
});



/* PUT - Update a menu item (admin only) */
app.put("/menu/:id", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to update menu!" });
    }

    const { name, description, price, image, category } = req.body;

    if (!name || !description || isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Invalid data!" });
    }

    const index = menu.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Item not found!" });

    menu[index] = { ...menu[index], name, description, price, image, category };

    // Rewrite to menu.js 
    const menuCode = `const menu = ${JSON.stringify(menu, null, 2)};\n\nmodule.exports = menu;\n`;
    fs.writeFileSync("./menu.js", menuCode);

    res.json({ message: "Menu item updated successfully!", item: menu[index] });
});



/* POST - Add new menu item (admin only) */
app.post("/menu", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to add menu!" });
    }

    const { name, description, price, image, category } = req.body;

    if (!name || !description || isNaN(price) || price <= 0 || !category) {
        return res.status(400).json({ message: "Invalid data!" });
    }

    // Find prefix by category
    const prefixMap = { coffee: "c", tea: "t", matcha: "m" };
    const prefix = prefixMap[category.toLowerCase()];
    if (!prefix) return res.status(400).json({ message: "Invalid category!" });

    // Find next number ID
    const existingIds = menu
        .filter(item => item.id && item.id.startsWith(prefix))
        .map(item => parseInt(item.id.substring(1)))
        .filter(num => !isNaN(num));
    const nextIdNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const id = `${prefix}${nextIdNum}`;

    const newItem = { id, name, description, price, image, category };
    menu.push(newItem);


    const menuCode = `const menu = ${JSON.stringify(menu, null, 2)};\n\nmodule.exports = menu;\n`;
    fs.writeFileSync("./menu.js", menuCode);

    res.status(201).json({ message: "Item added!", item: newItem });
});



/* DELETE - Delete menu item (admin only) */
app.delete("/menu/:id", authenticateToken, (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You do not have permission to delete!" });
    }

    const index = menu.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Item not found!" });

    menu.splice(index, 1);

    // Rewrite to menu.js 
    const menuCode = `const menu = ${JSON.stringify(menu, null, 2)};\n\nmodule.exports = menu;\n`;
    fs.writeFileSync("./menu.js", menuCode);

    res.json({ message: "Menu item deleted successfully!" });
});

/* Start the server */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
