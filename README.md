# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.






## Set Up Angular
npm install -g @angular/cli 
ng new my-app-name

## Set Up Certificate Authority
In order to properly use the app on localhost, it needs to be running over https or otherwise the cookies wont be sent.
### 1) Generate a key pair
In the cert folder ...
```
C:\"Program Files"\Git\usr\bin\openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```
or install openssl for windows and..
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```
### 2 ) Register the self-signed certificate as a CA trusted certificate authority
Run cert/securityTest.js
Launch chrome and go to “https://localhost:3000” 
in Chrome Dev tools...
	- go to security panel > view certificate > details > export  (** save it as a .cer file **) 

### 3) add custom cert to list of trusted root CAs
Go to chrome settings > security > manage device certificates > trusted root certification authorities tab(in certificates window) > import (then import the .cer file made in the previous step)
 
### When launching the angular app, use the following command 
```
ng s -o --ssl true --ssl-key <path to .key file>  --ssl-cert <path to .crt file>
```



