
# Set Up Angular
npm install -g @angular/cli 
ng new my-app-name

# Set Up Certificate Authority
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
Run cert/securityTest.js then
Launch chrome and go to “https://localhost:3000”. 
In Chrome Dev tools go to security panel > view certificate > details > export  (** save it as a .cer file **) 

### 3) Add custom cert to list of trusted root CAs
Go to chrome settings > security > manage device certificates > trusted root certification authorities tab (in certificates window) > import (then import the .cer file made in the previous step)
 
## When launching the angular app, use the following command 
```
ng s -o --ssl true --ssl-key <path to .key file>  --ssl-cert <path to .crt file>
```



### **Lastly, the fafa Icons installation & importing instructions can be found at src/app/fafa_installation.txt
<br/>
<br/>




# Launching The App
### 1) Install all node dependencies 
### 2) Run backend/backend.js
```
node backend.js
```
### 3) Run the angular application in ssl mode
```
ng s -o --ssl true --ssl-key <path to .key file>  --ssl-cert <path to .crt file>

```
### 4) open a web browser and to to "https://localhost:4200" <br/> <br/> <br/>



### if successful, the result should look like this ... <br/> <br/>
![Product Categories](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/categoriesPage.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/catalogPage.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/loginPage1.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/loginPage2.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/cartPage1.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/cartPage2.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/cartPage3.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/cartPage4.png)
![](https://github.com/amjadabu-mahfouz/Angular-Online-Store/blob/main/src/assets/angular%20app%20pics/cartPage5.png)
