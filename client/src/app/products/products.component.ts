import { Component, OnInit } from '@angular/core';
import { Product, ProductsService } from 'app/products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
    selector: 'products',
    templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
    private products: Product[];
    private category: string;
    private criteria: string;

    /**
     * Initializes a new instance of the ProductComponent class.
     *
     * @param productsService   The products service.
     */
    constructor(private productsService: ProductsService) {
        /* Default values */
        this.products = [];
        this.category = 'all';
        this.criteria = 'price-asc';
    }

    ngOnInit() {
        this.getProducts();
    }

    /**
     * Changes the category of items to display
     *
     * @param category The selected category.
     */
    private changeCategory(category: string): void {
        this.category = category;
        this.getProducts();
    }

    /**
     * Changes the criteria of items to display
     *
     * @param criteria The selected criteria.
     */
    private changeCriteria(criteria: string): void {
        this.criteria = criteria;
        this.getProducts();
    }

    /**
     * Retrieves all the products to a list
     */
    private getProducts(): void {
        this.productsService.getProducts(this.criteria, this.category).then((response) => {
            this.products = [];
            response.forEach(product => {
                const temp = new Product;
                /* Temp object to store the product's info before pushing to list */
                temp.id = product.id;
                temp.name = product.name;
                temp.price = product.price;
                temp.image = product.image;
                temp.category = product.category;
                temp.description = product.description;
                temp.features = product.features;
                /* Push temp to list */
                this.products.push(temp);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}