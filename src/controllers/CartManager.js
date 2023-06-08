import { promises as fs } from "fs";
import ProductManager from "./ProductManager.js"

const productAll = new ProductManager("./src/models/productos.json");

export default class CartManager {
    constructor(path) {
        this.path = "./src/models/carts.json";
        this.carts = [];
        this.id = 1;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                const lastCart = this.carts[this.carts.length - 1];
                this.id = lastCart.id + 1;
            }
        } catch (error) {
            console.log("Error al leer el archivo de carritos:", error);
        }
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    };

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    };

    getCartById = async (id) => {
        let cartById = this.carts.find((cart) => cart.id === parseInt(id));
        if (!cartById) return { error: 'No existe el carrito' };
        return cartById;
    };

    async addCart(cart = {}) {
        await this.loadCarts();
        cart.id = this.id++;
        delete cart.items;
        if (!cart.products) {
            cart.products = [];
        }
        this.carts.push(cart);
        await this.writeCarts(this.carts);
        return cart;
    }

    async addProductInCart(cartId, productId) {
        let cart = await this.getCartById(cartId);
        if (cart.error) return cart;

        let product = await productAll.getProductById(parseInt(productId));
        if (!product) {
            return { error: 'El ID del producto no existe' };
        }

        if (!cart.products) {
            cart.products = [];
        }

        const existingProduct = cart.products.find((p) => p.id === parseInt(productId)); 
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({
                id: parseInt(productId),
                quantity: 1
            });
        }

        await this.writeCarts(this.carts);
        return cart;
    }
}