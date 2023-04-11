import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { CatalogComponent } from './catalog/catalog.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { UserLogInComponent } from './user-log-in/user-log-in.component';



const routes: Routes = [
{path: '', redirectTo: '/product-categories', pathMatch: 'full'},
{path: 'product-categories', component: ProductCategoriesComponent},
{path: 'my-cart', component: MyCartComponent},
{path: 'userLogIn', component: UserLogInComponent},
{path: 'product-catalog/:cat', component: CatalogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
