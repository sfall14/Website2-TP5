import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

/**
 * Item class
 */
export class Item {
    productId: number;
    quantity: number;
}

/**
 * Shopping-Cart service class
 */
@Injectable()
export class ShoppingCartService {

    /* Total number of items (helpful for the display of badge in header) */
    private itemsCount: number;

    /* Emitter for the itemsCount changes so it auto updates the badge display */
    @Output() onItemsCountChange: EventEmitter<number> = new EventEmitter();

    /**
     * Handles the current error.
     *
     * @param error The error to handle.
     * @return {Promise<object>} A promise object.
     */
    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.feedbackMessage || error);
    }

    /**
     * Initializes a new instance of the ShoppingCartService class.
     *
     * @param http The HTTP service to use.
     */
    constructor(private http: HttpClient) {
        this.itemsCount = 0;
        this.getItems().then(items => {
            items.forEach(item => {
                this.itemsCount += item.quantity;
            });
        });
    }

    /**
     * Adds the current product in the shopping-cart.
     *
     * @param productId The id associated with the product.
     * @param quantity The quantity of the product.
     */
    addItem(productId, quantity): Promise<{}> {
        const url = `${Config.apiUrl}/shopping-cart`;

        return this.http.post(url, JSON.stringify({
            productId: productId,
            quantity: quantity
        }), Config.options).toPromise().then().catch(ShoppingCartService.handleError);
    }

    /**
     * Adds the number of items in the cart displayed in header.
     *
     * @param quantity The quantity of item(s) added in the cart.
     */
    addItemsCount(quantity: number): void {
        this.itemsCount += quantity;
        this.onItemsCountChange.emit(this.itemsCount);
    }

    /**
     * Removes an item from the shopping-cart.
     *
     * @param productId The id associated with the product.
     */
    deleteItem(productId: number): Promise<{}> {
        const url = `${Config.apiUrl}/shopping-cart/${productId}`;
        return this.http.delete(url, Config.options).toPromise().then().catch(ShoppingCartService.handleError);
    }

    /**
     * Removes all items in the shopping-cart.
     */
    deleteItems(): Promise<{}> {
        const url = `${Config.apiUrl}/shopping-cart`;
        return this.http.delete(url, Config.options).toPromise().then().catch(ShoppingCartService.handleError);
    }

    /**
     * Gets a single product that is in the database.
     *
     * @param productId The id associated with the product.
     */
    getItem(productId: number): Promise<Item> {
        const url = `${Config.apiUrl}/shopping-cart/${productId}`;
        return this.http.get(url, Config.options).toPromise().then(item => item as Item).catch(ShoppingCartService.handleError);
    }

    /**
     * Gets all the items that are currently in the shopping-cart.
     */
    getItems(): Promise<Item[]> {
        const url = `${Config.apiUrl}/shopping-cart`;
        return this.http.get(url, Config.options).toPromise().then(items => items as Item[]).catch(ShoppingCartService.handleError);
    }

    /**
     * Gets the number of items dislpayed in the nav bar.
     */
    getItemsCount(): number {
        return this.itemsCount;
    }

    /**
     * Substracts the number of items in the cart displayed in the nav bar.
     *
     * @param quantity The quantity of products removed from the cart.
     */
    subItemsCount(quantity: number): void {
        this.itemsCount -= quantity;
        this.onItemsCountChange.emit(this.itemsCount);
    }

    /**
     * Changes the quantity of a product in the shopping-cart.
     *
     * @param productId The id associated with the product.
     * @param quantity The new quantity of the product.
     */
    updateItem(productId, quantity): Promise<{}> {
        const url = `${Config.apiUrl}/shopping-cart/${productId}`;

        return this.http.put(url, JSON.stringify({
            productId: productId,
            quantity: quantity
        }), Config.options).toPromise().then().catch(ShoppingCartService.handleError);
    }

    /**
     * Updates the number of items in the cart displayed in the nav bar.
     *
     * @param quantity The appropriate quantity of items in the cart.
     */
    updateItemsCount(quantity: number): void {
        this.itemsCount = quantity;
        this.onItemsCountChange.emit(this.itemsCount);
    }
}