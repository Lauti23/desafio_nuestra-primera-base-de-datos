import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import { configSql, configSqlite } from "./options/config.js";
import { createDB, createTableSQL, createSqlite } from "./middlewares/middlewares.js";
import { Server } from "socket.io";

//MANAGER
import { Manager } from "./controller/Manager.js";
const productsManager = new Manager(configSql, "products");
const messagesManager = new Manager(configSqlite, "messages");

const app = express();

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", "src/public/views");
app.set("view engine", "handlebars");

app.get("/", createDB, createTableSQL, createSqlite, (req, res) => {
    res.render("index.handlebars")
})


const server = app.listen(8080, () => console.log("Server Up"))

const io = new Server(server);

io.on("connection", async socket => {
    console.log("Usuario conectado");

    const loadData = async () => {
        const products = await productsManager.getAll();
        const messages = await messagesManager.getAll();
        socket.emit("loadedProducts", products);
        socket.emit("loadedMessages", messages);
    }
    loadData();

    const updateProducts = async () => {
        let data = await productsManager.getAll();
        io.emit("loadedProducts", data);
    }

    const updateMessages = async () => {
        let data = await messagesManager.getAll();
        io.emit("loadedMessages", data);
    }

    socket.on("newProduct", async (prod) => {
        let id = await productsManager.insert(prod);
        let product = await productsManager.getById(id);
        io.emit("product", product);
        updateProducts();
    })

    socket.on("deleteProduct", async (id) => {
        await productsManager.deleteById(id);
        updateProducts();
    })

    socket.on("newMessage", async (msg) => {
        let id = await messagesManager.insert(msg);
        let message = await messagesManager.getById(id);
        io.emit("message", message);
    })
})