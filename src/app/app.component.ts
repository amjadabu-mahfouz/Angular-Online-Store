import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Online Store';
  
  
  	ngOnInit(): void {

	}
	
	getUsersName():string{
	  return localStorage.getItem("users_name") || "";
	}
  
	userLogout(){
		console.log("LOG OUT");
		localStorage.removeItem("token");
		localStorage.removeItem("users_name");
	}
	
}
