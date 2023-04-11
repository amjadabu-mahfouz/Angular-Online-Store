import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import * as moment from 'moment'; // npm install moment ... also set "allowSyntheticDefaultImports: true" compiler option  in ts.config for this pkg to work

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {



	constructor(private http: HttpClient) { }
  
	 userLogin(email : string, pass: string){
		
		let headers = new HttpHeaders()
		.set('Content-Type', 'application/json');
		
		let res =  this.http.post("https://localhost:8989/userLogin", JSON.stringify( {email: email, pw: pass} ), { headers: headers, withCredentials: true})
		return res;
		
	}
	
	userCreate(params: any){
		
		let headers = new HttpHeaders()
		.set('Content-Type', 'application/json');
		
		let res =  this.http.post("https://localhost:8989/userSignUp", JSON.stringify( params ), { headers: headers, withCredentials: true})
		return res;
		
	}

  //save POST response token and its expiration time 
  sessionInit(postResult : any){ 				
		this.userlogout();
		postResult = JSON.parse(postResult);
		
		console.log("result from login: " + postResult.token);
	
		
		if(postResult.token){

			localStorage.setItem('token', postResult.token);
			localStorage.setItem('users_name', postResult.username);

			//console.log("LOCAL STORAGE TOKEN : " + localStorage.getItem("token"));
			
		}
		else{
			//console.log("NO TOKEN from RESPONSE");
		}
  }
  
  
  
    userlogout() {
        localStorage.removeItem("token");
		localStorage.removeItem("users_name");
        //localStorage.removeItem("expires_at");
    }
  
}
