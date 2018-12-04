import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';

/**
 * Defines the main component of the application.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    readonly authors = [
        'Anthony Abboud',
        'Sidy Fall'
    ];

    private cartCount: number;

    constructor(private shoppingCartService: ShoppingCartService) {
        this.cartCount = 0;
        this.shoppingCartService.onItemsCountChange.subscribe(itemsCount => {
            this.cartCount = itemsCount;
        });
    }

    ngOnInit() {
        this.shoppingCartService.getItems().then(items => {
            items.forEach(item => {
                this.cartCount += item.quantity;
            });
        }).catch(err => {
            console.log(err);
        });
    }
}