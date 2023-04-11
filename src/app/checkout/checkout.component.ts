import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { FormControl, Validators, ValidatorFn, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';

import { AuthServiceService } from '../auth-service.service';
import { interval, firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
	
	constructor(
		private formBuilder: FormBuilder, 
		private authService: AuthServiceService, 
		private location: Location,
		private http: HttpClient
	){ }


	ngOnInit(): void {
		
	}


}
