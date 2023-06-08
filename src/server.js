import express from 'express';
import productRouter from './router/product.routes.js';
import cartRouter from './router/cart.routes.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter)
app.use("/api/carts", cartRouter)


const server = app.listen(PORT, () => {
    console.log(`Express por local Host ${server.address().port}`)
});
server.on("error", error => console.log(`Error en servidor ${error}`));
