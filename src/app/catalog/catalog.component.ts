import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { productCategory } from '../productCategory';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { product } from '../product';

//font awsome icons
import { faStar } from '@fortawesome/free-solid-svg-icons'; 
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { FormControl, Validators } from '@angular/forms';

import { cartItem } from '../cartItem';


/**
go into the tsconfig.son file and add this property otherwise you will need to init all variables all the time w. errors
"compilerOptions": {
    "strictPropertyInitialization": false,
    ...
}





**/

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})

export class CatalogComponent implements OnInit {

	catName: string ="";
	productsFromSearch : product[];
	
	starIcon = faStar;
	cartIcon = faShoppingCart;
	
	cartPattern = new RegExp('^[0-9]{0,4}$');
	
	
	formControlsArray : FormControl[];
	
	
	
	
	constructor(
		private route: ActivatedRoute,
		private http: HttpClient,
		private location: Location
	) {}
	
	
	ngOnInit(): void {
		this.catName = "";
		this.productsFromSearch = [];
		this.formControlsArray = [];
		
		this.getProducts();
		
	}
	
	
	getProducts():void{
		const check = this.route.snapshot.paramMap.get('cat');
		if(check != null){
			this.catName = check;
			this.backendQuery("https://localhost:8989/getProducts", {"category":this.catName} );
		}
		else{
		}
	}
	
	
	backendQuery(url: string, params : Object) {
		
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
			//headers.set('Access-Control-Allow-Origin', 'https://localhost:4200');
			
	
		this.http.post(url, JSON.stringify( params ), { headers: headers, observe: 'response', withCredentials: true})
		.subscribe(data => {
			if(url.includes("getProducts")){
				console.log(data);
				this.productsFromSearch = <product[]> data.body; //cast the data into this
				this.formControlsPopulate(); //populate form controls so that values could be verfied
			}
			else if(url.includes("updateCart")){
				//console.log(data.body);
			}
		});
	}


	//function to return list of numbers from 0 to n-1 ==> used for ngFor in the html component section
	numSequence(n: number): Array<number> {
		return Array(n);
	}
	


	cartSubmit(productID:number, ind:number, price:number){
		//console.log("productID: " + productID );
		//console.log("quantity: " + this.formControlsArray[ind].value );
		//console.log("price: " + (price - (this.productsFromSearch[ind].discount * price)));
		if(!(this.formControlsArray[ind].value == 0)){
			this.backendQuery("https://localhost:8989/updateCart", {"id":productID, "qty":this.formControlsArray[ind].value, "price":(price - (this.productsFromSearch[ind].discount * price))} );
		}

	}
	
	
	

	formControlsPopulate(){
		for(var row of this.productsFromSearch){
			this.formControlsArray.push(new FormControl('0', [Validators.required, Validators.pattern('^[0-9]{0,4}$')]));
		}
	}

}


