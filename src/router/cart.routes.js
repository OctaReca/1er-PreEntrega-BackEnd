import { Router } from "express";
import CartManager from '../controllers/CartManager.js';

const cartRouter = Router();
const cartManager = new CartManager('./src/models/carts.json');

cartRouter.get('/', async (req, res) => {
    res.send(await cartManager.readCarts());
});

cartRouter.get('/:id', async (req, res) => {
    res.send(await cartManager.getCartById(req.params.id));
});

cartRouter.post('/', async (req, res) => {
    res.send(await cartManager.addCart());
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    let cardId = req.params.cid;
    let productId = req.params.pid;
    res.send(await cartManager.addProductInCart(cardId, productId));
})

export default cartRouter;
