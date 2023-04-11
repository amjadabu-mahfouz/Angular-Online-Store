import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'; //for url param
import { Router } from '@angular/router';

import { product } from '../product';

import { HttpClient, HttpHeaders } from '@angular/common/http'; //must import httpclient in app.module to use this

import { FormControl, Validators, ValidatorFn, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';

import { AuthServiceService } from '../auth-service.service';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard} from '@fortawesome/free-solid-svg-icons';
import { faInstitution} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa} from '@fortawesome/free-brands-svg-icons';
import { faCcAmex} from '@fortawesome/free-brands-svg-icons';
import { faCcMastercard} from '@fortawesome/free-brands-svg-icons';
import { faCcDiscover} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {

	returnedProducts : any[];
	checkoutBTN:boolean;
	originalQty : number[];
	
	cartIcon = faShoppingCart;
	userIcon = faUser;
	mailIcon = faEnvelope;
	addressIcon = faAddressCard;
	cityIcon = faInstitution;
	
	visaIcon = faCcVisa;
	amexIcon = faCcAmex;
	mastercardIcon = faCcMastercard;
	discoverIcon = faCcDiscover;
	
	
	fg : FormGroup; 
	
	fgCheckout : FormGroup;
	
	date : Date;
	
	checkoutSubmit : boolean;
	
	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder, 
		private authService: AuthServiceService,
		private router: Router,
		private http: HttpClient
	){ }


	ngOnInit(): void {

		this.date =  new Date();
		this.originalQty = [];
		this.checkoutBTN = false;
		this.checkoutSubmit = false;
		this.fg = this.formBuilder.group({ });
		this.fgCheckout = this.formBuilder.group({ });
		this.checkoutFormControlsPopulate();
		this.getCartSession("https://localhost:8989/getCartItems", {});
		
	}
	
	
	
	getCartSession(url: string, params : Object) {

		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		this.http.post(url, JSON.stringify( params ), { headers: headers, observe: 'response', withCredentials: true})
		.subscribe(data => {
			let returnMSG = data.body;
			if(url.includes("getCartItems") && returnMSG == "empty cart"){
				this.checkoutBTN = false;
				//console.log("CHECKOUT BTN: " + this.checkoutBTN);
				this.returnedProducts = [];
			}
			else if(!(returnMSG == "empty cart") && url.includes("getCartItems")){
				this.checkoutBTN = true;
				//console.log("CHECKOUT BTN T: " + this.checkoutBTN);
				this.returnedProducts = <product[]> data.body;
				this.cartFormControlsPopulate();
			}
			
		});
	}
	
	
	cartFormControlsPopulate(){
		let ind = 0;
		for(let row of this.returnedProducts){
			this.fg.addControl("product"+ind, new FormControl(row.qty, [Validators.required, Validators.pattern('^[1-9][0-9]{0,3}$')]));
			this.originalQty.push(row.qty);
			ind++;
		}

	}
	
	checkoutFormControlsPopulate(){
		this.fgCheckout.addControl("FullName", new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z ]{3,}')]));
		this.fgCheckout.addControl("Email", new FormControl("", [Validators.required, Validators.pattern('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$')]));
		this.fgCheckout.addControl("Address", new FormControl("", [Validators.required]));
		this.fgCheckout.addControl("City", new FormControl("", [Validators.required]));
		this.fgCheckout.addControl("Province", new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]*')]));
		this.fgCheckout.addControl("Zip", new FormControl("", [Validators.required, Validators.pattern('^[0-9]{5}$|^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$')]));
		this.fgCheckout.addControl("CardName", new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]*')]));
		this.fgCheckout.addControl("CardNumber", new FormControl("", [Validators.required, Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}(?:2131|1800|35\d{3})\d{11})$')]));
		this.fgCheckout.addControl("ExpMonth", new FormControl("", [Validators.required, Validators.pattern('^(0?[1-9]|1[012])$')]));
		let yr = this.date.getFullYear();
		this.fgCheckout.addControl("ExpYear", new FormControl("", [Validators.required, this.yearValidator(yr)]));
		this.fgCheckout.addControl("CCV", new FormControl("", [Validators.required, Validators.pattern('^[0-9]{3,}$')]));

	}
	
	
	goToCheckout(){
		if(localStorage.getItem("token")){
			this.checkoutSubmit = true;
			this.checkoutBTN = false;
		}
		else{
			alert("Must Be Signed in to Proceed to Checkout.");
		}

	}
	
	
	userCheckout(){
		
		let cartBatch : any[];
		cartBatch = [];
		
		for(let row of this.returnedProducts){
			cartBatch.push({
				product_id: row.id,
				qty: row.qty,
				price: row.price
			});
		}
		
		let params = {
			full_name : this.fgCheckout.get('FullName')!.value,
			email : this.fgCheckout.get('Email')!.value,
			address : this.fgCheckout.get('Address')!.value,
			city : this.fgCheckout.get('City')!.value,
			prov : this.fgCheckout.get('Province')!.value,
			zip : this.fgCheckout.get('Zip')!.value,
			card_name : this.fgCheckout.get('CardName')!.value,
			card_number : this.fgCheckout.get('CardNumber')!.value,
			exp_month : this.fgCheckout.get('ExpMonth')!.value,
			exp_year : this.fgCheckout.get('ExpYear')!.value,
			ccv : this.fgCheckout.get('CCV')!.value,
			cart: cartBatch
		};
		

		//send checkout + cart info
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		this.http.post("https://localhost:8989/userCheckout", JSON.stringify( params ), { headers: headers, observe: 'response', withCredentials: true})
		.subscribe(data => {
		
			let resMSG = JSON.stringify(data.body);
			if(resMSG.includes("expired")){
				//console.log("SESSION EXPIRED, THIS USER NEED TO RELOG!");
				this.authService.userlogout();
				this.router.navigateByUrl('/userLogIn');
				alert("SESSION EXPIRED, THIS USER NEED TO RELOG INORDER TO CHECKOUT");
				
			}
			else{
				//console.log("CHECKOUT IS SUSSESSFUL!!");
				
				this.router.navigateByUrl('/product-categories');
				alert("CHECKOUT SUCCESSFUL");
			}
		
		});
		
	}
	
	
	//validate year >= current year	
	yearValidator(minYear: number): ValidatorFn{
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			
			if (control.value !== undefined && !( control.value >= minYear ) ) {
				return { 'validYear': true };
			}

        return null;
		};
		
	}
	
	
	getTotalPrice():number{  
		let totalPrice: number = 0;
		
		if(this.returnedProducts){
			for(let row of this.returnedProducts){
				totalPrice += row.qty * row.price;
			}
		}
		else{
			totalPrice = 0;
		}
		return totalPrice;
	}
	
	
	disableInput(ind:number):boolean{

		let val : number = 9999;
		if(this.fg.get("product"+ind)){
			val = this.fg.get("product"+ind)!.value;
		
			if(val > 999){
				this.fg.get("product"+ind)!.setValue(this.originalQty[ind]) ;
				
				return false;
			}
			else{
				return false;
			}
		
		}
		
		return false;

		
	}
	
	
	checkValidControl(fcName: string):boolean{
		if(this.fgCheckout.get(fcName)){
				return this.fgCheckout.get(fcName)!.valid;
		}
		return false;
	}
	
	
	
	
	removeItem(id:string):void{
		let params = {id: id, qty:0, price:0};
		this.getCartSession("https://localhost:8989/updateCart", params);
		this.getCartSession("https://localhost:8989/getCartItems", {});
	}
	
	
}
