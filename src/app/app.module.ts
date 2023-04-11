import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogComponent } from './catalog/catalog.component';

import { FormsModule } from '@angular/forms';
import { ProductCategoriesComponent } from './product-categories/product-categories.component'; // <-- Used For NgModel 
import { MyCartComponent } from './my-cart/my-cart.component';

import { UserLogInComponent } from './user-log-in/user-log-in.component';
//add http module
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

//add the fafa library
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'


//reactive forms
import { ReactiveFormsModule } from '@angular/forms';


// http_interceptor for all post requests preprocessing before sending
// the class is made by the following command "ng generate interceptor "interceptor_name>"  ==> **must add it to the providers array for it to be available
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckoutComponent } from './checkout/checkout.component';




@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    ProductCategoriesComponent,
    MyCartComponent,
    UserLogInComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule, 
	FontAwesomeModule, //fafa library
	ReactiveFormsModule,
	FormsModule
  ],
  providers: [							//include the http_interceptor here for project-wide scope
	{
		provide: HTTP_INTERCEPTORS,
		useClass: AuthInterceptor,
		multi: true
	}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
