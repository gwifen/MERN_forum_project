require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")
const tokenVerification = require('./middleware/tokenVerification')

const app = express()
connection()
const port = process.env.PORT || 8080


//middleware 
app.use(express.json())
app.use(cors())

//trasy wymagające weryfikacji tokenem:
app.get("/api/users/", tokenVerification)


//POTEM trasy nie wymagające tokena (kolejnośd jest istotna!)
app.use("/api/users/account", userRoutes);
app.use("/api/users/delete", userRoutes);
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)

//tylko metoda get wymaga tokena

//=========================
// app.use("/api/auth", authRoutes);

// app.use("/api/users", userRoutes);
// app.use("/api/users/account", userRoutes);
// app.use("/api/users/delete", userRoutes);


app.listen(port, ()=>console.log(`Nasluchiwanie na procie ${port}`))

