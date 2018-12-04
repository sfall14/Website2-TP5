import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { ProductsService } from 'app/products.service';

/**
 * Defined a product in the cart with all the necessary info
 */
class CartProduct {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

    /* List of products and total number of products */
    private products: CartProduct[];
    private total: number;

    /**
     * Initializes a new instance of the ProductComponent class.
     *
     * @param shoppingCartService The shopping-cart service to use.
     * @param productService The products service to use.
     */
    constructor(private shoppingCartService: ShoppingCartService, private productService: ProductsService) {
        this.products = [];
        this.total = 0;
    }

    ngOnInit() {
        this.shoppingCartService.getItems().then(items => {
            items.forEach(item => {
                this.productService.getProduct(item.productId).then(product => {
                    const cartProduct = new CartProduct;

                    cartProduct.id = item.productId;
                    cartProduct.name = product.name;
                    cartProduct.price = product.price;
                    cartProduct.quantity = item.quantity;

                    this.products.push(cartProduct);
                    this.total += product.price * item.quantity;
                    this.sortByName();
                });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Increment item quantity in the cart
     *
     * @param productId The id associated with the product to be updated.
     */
    private addQuantity(productId: number): void {
        this.products.forEach(product => {
            if (productId == product.id) {
                product.quantity += 1;
                this.shoppingCartService.updateItem(productId, product.quantity).then(() => {
                    this.total += product.price;
                    this.shoppingCartService.addItemsCount(1);
                    return;
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    }

    /**
     * Remove all items from the cart.
     */
    private removeAllItems(): void {
        if (confirm('Voulez-vous supprimer tous les produits du panier?')) {
            this.shoppingCartService.deleteItems().then(() => {
                this.products = [];
                this.total = 0;
                this.shoppingCartService.updateItemsCount(0);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    /**
     * Removes item from the cart defined by the productId
     * 
     * @param productId The id associated with the product to be removed.
     */
    private removeItem(productId: number): void {
        if (confirm('Voulez-vous supprimer le produit du panier?')) {
            this.products.forEach(product => {
                if (productId == product.id) {
                    this.shoppingCartService.deleteItem(productId).then(() => {
                        this.total -= product.price * product.quantity;
                        this.shoppingCartService.subItemsCount(product.quantity);
                        this.products.splice(this.products.indexOf(product), 1);
                        return;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        }
    }

    /**
     * Removes one copy of the product from the cart.
     *
     * @param productId The id associated with the product to be updated.
     */
    private removeQuantity(productId: number): void {
        this.products.forEach(product => {
            if (productId == product.id) {
                product.quantity -= 1;
                this.shoppingCartService.updateItem(productId, product.quantity).then(() => {
                    this.total -= product.price;
                    this.shoppingCartService.subItemsCount(1);
                    return;
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    }

    /**
     * Sorts by name the products displayed in the cart.
     */
    private sortByName(): void {
        this.products.sort((productA, productB) => {
            if (productA.name < productB.name) {
                return -1;
            }
            return 1;
        });
    }
}