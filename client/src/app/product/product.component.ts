import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from 'app/products.service';
import { ShoppingCartService } from 'app/shopping-cart.service';

/**
 * Defines the component responsible to manage the product page.
 */
@Component({
    selector: 'product',
    templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

    private product: Product;
    private quantity: number;
    private dialogVisibility: boolean;
    private productFound: boolean;

    /**
     * Initializes a new instance of the ProductComponent class.
     *
     * @param route                   The active route.
     * @param productsService         The products service.
     */
    constructor(private route: ActivatedRoute, private productsService: ProductsService, private shoppingCartService: ShoppingCartService) {
        this.quantity = 1;
        this.dialogVisibility = false;
        this.productFound = false;
        this.product = new Product;
        this.product.image = 'white.png';
        this.product.price = 0;
        this.product.features = [];
    }

    /**
     * Gets the selected product
     */
    ngOnInit() {
        const productId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

        this.productsService.getProduct(productId).then((product) => {
            const temp = new Product;

            temp.id = product.id;
            temp.name = product.name;
            temp.price = product.price;
            temp.image = product.image;
            temp.category = product.category;
            temp.description = product.description;
            temp.features = product.features;

            this.product = temp;
            this.productFound = true;
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * Adds the product with the appropriate quantity in the shopping cart.
     */
    private addProduct(): void {
        this.shoppingCartService.getItems().then(items => {
            let itemIsFound = false;
            items.forEach(item => {
                /* If the item is found, only increment that item's quantity */
                if (item.productId === this.product.id) {
                    itemIsFound = true;
                    const oldQuantity = item.quantity;
                    this.shoppingCartService.updateItem(this.product.id, this.quantity).then(() => {
                        const itemsCount = this.shoppingCartService.getItemsCount() - oldQuantity + this.quantity;
                        this.shoppingCartService.updateItemsCount(itemsCount);
                        this.showDialog();
                        return;
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });

            /* If the item wasn't found, means the quantity will be 1 added to shopping-cart */
            if (itemIsFound == false) {
                this.shoppingCartService.addItem(this.product.id, this.quantity).then(() => {
                    this.shoppingCartService.addItemsCount(this.quantity);
                    this.showDialog();
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Shows the dialog, lasting 5000 ms
     */
    private showDialog() {
        this.dialogVisibility = true;
        setTimeout(() => { this.dialogVisibility = false; }, 5000);
    }
}