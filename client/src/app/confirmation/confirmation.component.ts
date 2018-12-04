import { Component, OnInit } from '@angular/core';
import { Order, OrdersService } from 'app/orders.service';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
    selector: 'confirmation',
    templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {

    private order: Order;

    constructor(private ordersService: OrdersService) {
        this.order = new Order;
    }

    ngOnInit() {
        this.ordersService.getOrders().then(orders => {
            this.order = orders[orders.length - 1];
        }).catch(err => {
            console.log(err);
        });
    }
}