import { promises as fs } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = "./src/models/productos.json";
        this.products = [];
        this.id = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.id = lastProduct.id + 1;
            }
        } catch (error) {
            console.log('Error al leer el archivo de productos:', error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log('Error al guardar el archivo de productos:', error);
        }
    }

    async addProduct(product) {
        await this.loadProducts(); // Cargar productos existentes
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.code ||
            !product.stock ||
            !product.category
        ) {
            console.log('Todos los campos son obligatorios');
            return;
        }
        if (this.products.some((p) => p.code === product.code)) {
            return 'Ya existe un producto con ese código';
        }
        const newProduct = {
            title: product.title,
            description: product.description,
            price: product.price,
            status: true,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            id: this.id++,
        };
        this.products.push(newProduct);
        await this.saveProducts();
        return `Producto agregado correctamente: ${newProduct.title}, su id es: ${newProduct.id}`;
    }

    async getProducts() {
        await this.loadProducts(); // Traer todos los productos
        return this.products;
    }
    
    async getProductById(id) {
        await this.loadProducts(); // Traer un producto por id
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            return('Producto no encontrado');
        }
        return product;
    }
    
    async updateProduct(id, updatedFields) {
        await this.loadProducts(); // Cargar productos actualizados
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return('Producto no encontrado');
            return;
        }
        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        await this.saveProducts();
        return('Producto actualizado correctamente');
    }
    async deleteProduct(id) {
        await this.loadProducts(); // Eliminar producto
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            return('Producto no encontrado');
            return;
        }
        this.products.splice(productIndex, 1);
        await this.saveProducts();
        return('Producto eliminado correctamente');
    }
}
