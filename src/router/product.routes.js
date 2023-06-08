import { Router } from "express";
import ProductManager from '../controllers/ProductManager.js';

const productRouter = Router()
const productManager = new ProductManager('./src/models/productos.json')
const allproducts = productManager.getProducts();

productRouter.get("/", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await productManager.getProducts());
    let allproducts = await productManager.getProducts();
    let productLimit = allproducts.slice(0, limit);
    res.send(productLimit);
});

productRouter.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allproducts = await productManager.getProducts();
    let productById = allproducts.find((p) => p.id === id);
    if(!productById) return res.send({error: "Producto no encontrado"})
    res.send(productById);
});

productRouter.post("/", async (req, res) => {
    let newProduct = req.body;
    res.send(await productManager.addProduct(newProduct));
    console.log(newProduct);
})

productRouter.put("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allproducts = await productManager.getProducts();
    let productById = allproducts.find((p) => p.id === id);
    if(!productById) return res.send({error: "Producto no encontrado"})
    let productUpdate = req.body;
    res.send(await productManager.updateProduct(id, productUpdate));
})

productRouter.delete("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allproducts = await productManager.getProducts();
    let productById = allproducts.find((p) => p.id === id);
    if(!productById) return res.send({error: "Producto no encontrado"})
    res.send(await productManager.deleteProduct(id));
})

export default productRouter;