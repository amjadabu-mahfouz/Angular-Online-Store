import { Component } from '@angular/core';
import { ProductCategories } from '../productCategories';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent {
	prodCat =  ProductCategories;
}
