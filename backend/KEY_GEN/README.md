# Generate a key pair (used for JWT)
```
C:\"Program Files"\Git\usr\bin\openssl.exe genrsa -des3 -out private.pem 2048

C:\"Program Files"\Git\usr\bin\openssl.exe rsa -in private.pem -outform PEM -pubout -out public.pem
```

##You MUST resave these in a NEW FILE because of windows formatting!!!




