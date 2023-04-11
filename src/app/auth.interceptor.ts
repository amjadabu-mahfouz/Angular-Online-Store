import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
  private authService: AuthServiceService 
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
  
		
    
        const token = localStorage.getItem("token");
		
		//if jwt token exists ==> clone the request headers and add an additional "Authroization" header with the token
        if (token) { 
				
			const cloned = request.clone({
				headers: request.headers.set("Authorization", token)
			});
				
			return next.handle(cloned);
			

            
        }
        else {
			console.log("NO JWT TOKEN");
            return next.handle(request); //pass request unmodified
        }
  
  
  
  
  
  
  }
  
}
