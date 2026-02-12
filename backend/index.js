import "dotenv/config"
import cors from "cors"
import express from "express"
import session from "express-session"
import bcrypt from "bcrypt"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: "http://localhost:63342",
    credentials: true
}))

app.use(session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}))

let users = []

app.post("/register", async (req, res) => {
    const { name, email, password, isAdmin } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Fill all fields" })
    }

    const exists = users.find(u => u.email === email)
    if (exists) {
        return res.status(400).json({ error: "Email exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashed,
        role: isAdmin ? "admin" : "user"
    }

    users.push(newUser)

    req.session.user = {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role
    }

    res.json(req.session.user)
})


app.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = users.find(u => u.email === email)
    if (!user) return res.json({ error: "User not found" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.json({ error: "Wrong password" })

    req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role
    }

    res.json(req.session.user)
})


app.get("/profile", (req, res) => {
    if (!req.session.user)
        return res.json({ error: "Not logged" })

    res.json(req.session.user)
})


app.get("/admin", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }

    const safeUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role
    }))

    res.json(safeUsers)
})

app.put("/admin/role/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }

    const user = users.find(u => u.id === req.params.id)
    if (!user) return res.json({ error: "User not found" })

    user.role = user.role === "admin" ? "user" : "admin"

    res.json({ success: true })
})


app.delete("/admin/:id", (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
    }

    users = users.filter(u => u.id !== req.params.id)
    res.json({ success: true })
})

app.listen(process.env.APP_PORT,()=> console.log("Server is running"))
