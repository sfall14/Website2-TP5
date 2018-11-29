import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from '../products.service';


/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  // TODO: À compléter

  products: Product[];
  category: string;
  sortingCriteria: string;

  onSelectCategory(Selectedcategory: string): void {
    if (!Selectedcategory) {
      this.category = 'all';
    } else {
      this.category = Selectedcategory;
    }
  }

  ngOnInit() {
    this.productsService
      .getProducts(null ,this.category)
      .then(result => this.products = result)
      .catch(error => console.log(error));
  }

  constructor(private productsService: ProductsService) { }

  
}
