import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { HttpClient, HttpHeaders } from '@angular/common/http'; //must import httpclient in app.module to use this
import { FormControl, Validators, ValidatorFn, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';

import { AuthServiceService } from '../auth-service.service';
import { interval, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-log-in',
  templateUrl: './user-log-in.component.html',
  styleUrls: ['./user-log-in.component.css']
})
export class UserLogInComponent implements OnInit {

	userSignupForm : FormGroup; 
	userLoginForm : FormGroup; 
	countries : any;
	selectedCountry : string;
	
	
	date: Date;
	
	method : string;

	constructor(
		private formBuilder: FormBuilder, 
		private authService: AuthServiceService, 
		private location: Location,
		private http: HttpClient
	){ }


	ngOnInit(): void {
		this.date =  new Date();
		this.method = "login";
		this.selectedCountry = "Canada";
		this.countries ={
			Countries: ["Canada", "UnitedStates"],
			Canada : ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"],
			UnitedStates: ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", 
						"GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD",
						"MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
						"NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC",
						"SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI","WY"]
		};
		
		this.userSignupForm = this.formBuilder.group({ });
		this.userLoginForm = this.formBuilder.group({ });
		
		this.createFormGroupControls();
		
	
		
	}
	

	
	createFormGroupControls(){
		this.userSignupForm.addControl("FirstName", new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]*')])); //Names must contain only letters
		this.userSignupForm.addControl("LastName", new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z]*')])); //Names must contain only letters
		this.userSignupForm.addControl("Email", new FormControl("", [Validators.required, Validators.pattern('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$')]));
		this.userSignupForm.addControl("Password", new FormControl("", [Validators.required])); //Passwords must contain at least one number and one uppercase and lowercase letter, and at least 5 or more characters
		this.userSignupForm.addControl("Password2", new FormControl("", [Validators.required, this.confirmPassword()]));
		this.userSignupForm.addControl("DateOfBirth", new FormControl("", [Validators.required, this.ageValidator(18)]));
		this.userSignupForm.addControl("Country", new FormControl("", [Validators.required]));
		this.userSignupForm.addControl("Province", new FormControl("", [Validators.required]));
		
		this.userLoginForm.addControl("LoginEmail", new FormControl("", [Validators.required, Validators.pattern('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$')]));
		this.userLoginForm.addControl("LoginPassword",  new FormControl("", [Validators.required]));
	}
	
	createUserSubmission(){
		
	}
	
	createUser() {

		let params = {
			first_name : this.userSignupForm.get('FirstName')!.value,
			last_name : this.userSignupForm.get('LastName')!.value,
			email : this.userSignupForm.get('Email')!.value,
			dob : this.userSignupForm.get('DateOfBirth')!.value,
			user_secret: this.userSignupForm.get('Password')!.value,
			country : this.userSignupForm.get('Country')!.value,
			prov : this.userSignupForm.get('Province')!.value
		};
			
			//console.log(params);
		
		
		let x = "";
		this.authService.userCreate(params).subscribe(res =>{
			res = JSON.stringify(res);
			//console.log(res);
			this.method = "login";
			
		});
		
	}
	
	
	async userLogin(){
		let params = {
			email : this.userLoginForm.get('LoginEmail')!.value,
			pw :  this.userLoginForm.get('LoginPassword')!.value
		};
		
		let headers = new HttpHeaders()
			.set('Content-Type', 'application/json');
		

		let x = "";
		this.authService.userLogin(params.email, params.pw).subscribe(res =>{
			res = JSON.stringify(res);
			let logCheck = JSON.stringify(res);
			if(logCheck.includes("Invalid Password") || logCheck.includes("does not exist!") ){
				//console.log("LOGIN FAILED");
				alert("Login Failed");
			}
			else{
				//console.log("LOGIN SUCCESS");
				this.authService.sessionInit(res); //initiate the session by passing returned token to authService
				this.location.back();
			}	

		});

	}
	
	
	checkValidControl(fcName : string, fcGroup: string):boolean{
		if(fcGroup == "create"){
			if(this.userSignupForm.get(fcName)){
				return this.userSignupForm.get(fcName)!.valid;
			}
		}
		else{
			if(this.userLoginForm.get(fcName)){
				return this.userLoginForm.get(fcName)!.valid;
			}
		}
		
		return false;
	}


	//custom validator for age > 18
	ageValidator(minYears: number): ValidatorFn{
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			
			let xx = this.date.getFullYear() - control.value.split("-")[0] ;
			
			if (control.value !== undefined && !(  xx >= minYears && xx < 120 ) ) {
				return { 'validAge': true };
			}

        return null;
		};
		
	}


	//confirm password
	confirmPassword(): ValidatorFn{
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			
			let pw2 = this.userSignupForm.get('Password')!.value;
			//console.log("PG PW: " + pw2 + "   CONFIRM VALUE : " + control.value );
			
			if (control.value !== undefined &&  control.value != pw2) {
				return { 'validPass': true };
			}

        return null;
		};
		
	}

	setMethod(meth : string){
		this.method = meth;
	}

}
