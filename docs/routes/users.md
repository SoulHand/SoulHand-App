Usuarios
===================

Crear Usuarios
--------------------

```curl
POST /v1/users/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```

añade un Usuario a la colección de Usuarios existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**dni**:string

**username**:string

**email**:string

**password**:string

### Respuesta

```json
{
  "__v":0,
  "username":"Paige.Koelpin",
  "email":"Clementina.Treutel@example.org",
  "people":
  {
    "dni":"V13145679",
    "name":"PEOPLE",
    "birthdate":"1992-03-15",
    "mode":"TEACHER",
    "__v":0,
    "_id":"58f182276ab6ee144a716c43",
    "createDate":"2017-04-15T02:15:03.094Z"
  },
  "_id":"58f182276ab6ee144a716c4e",
  "isAdmin":false,
  "dateCreated":"2017-04-15T02:15:03.853Z"
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/users/
	
```
obtiene todas los Usuarios existente
### Respuesta

```json
[
  {
    "__v":0,
    "username":"Paige.Koelpin",
    "email":"Clementina.Treutel@example.org",
    "people":
    {
      "dni":"V13145679",
      "name":"PEOPLE",
      "birthdate":"1992-03-15",
      "mode":"TEACHER",
      "__v":0,
      "_id":"58f182276ab6ee144a716c43",
      "createDate":"2017-04-15T02:15:03.094Z"
    },
    "_id":"58f182276ab6ee144a716c4e",
    "isAdmin":false,
    "dateCreated":"2017-04-15T02:15:03.853Z"
  },
  {
    "__v":0,
    "username":"maid.holed",
    "email":"Clementina.Treutel@example.org",
    "people":
    {
      "dni":"V13145679",
      "name":"PEOPLE",
      "birthdate":"1992-03-15",
      "mode":"TEACHER",
      "__v":0,
      "_id":"58f182273ab6ee144a716c43",
      "createDate":"2017-04-15T02:15:03.094Z"
    },
    "_id":"58f182276ab7ee144a716c4e",
    "isAdmin":false,
    "dateCreated":"2017-04-15T02:15:03.853Z"
  }
]
```
Obtener un Usuario
--------------------

```curl
GET /v1/users/
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/courses/58f182276ab6ee144a716c4e
{
  "__v":0,
  "username":"Paige.Koelpin",
  "email":"Clementina.Treutel@example.org",
  "people":
  {
    "dni":"V13145679",
    "name":"PEOPLE",
    "birthdate":"1992-03-15",
    "mode":"TEACHER",
    "__v":0,
    "_id":"58f182276ab6ee144a716c43",
    "createDate":"2017-04-15T02:15:03.094Z"
  },
  "_id":"58f182276ab6ee144a716c4e",
  "isAdmin":false,
  "dateCreated":"2017-04-15T02:15:03.853Z"
}
```

editar un Usuario
--------------------

```curl
PUT /v1/users/:id
```

editar un Usuario de la colección de Usuarios existente

### Parametros

**id**:mongoId

###  Entrada

**username**:string

**email**:string

**password**:string

### Respuesta

```json
//ejemplo para /v1/users/58f182276ab6ee144a716c4e
{
  "__v":0,
  "username":"Paige.Koelpin",
  "email":"Clementina.Treutel@example.org",
  "people":
  {
    "dni":"V13145679",
    "name":"PEOPLE",
    "birthdate":"1992-03-15",
    "mode":"TEACHER",
    "__v":0,
    "_id":"58f182276ab6ee144a716c43",
    "createDate":"2017-04-15T02:15:03.094Z"
  },
  "_id":"58f182276ab6ee144a716c4e",
  "isAdmin":false,
  "dateCreated":"2017-04-15T02:15:03.853Z"
}
```

eliminar un Usuario
--------------------

```curl
DELETE /v1/users/:id  
```

elimina un Usuario de la colección de Usuarios existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/users/58f182276ab6ee144a716c4e
{
  "__v":0,
  "username":"Paige.Koelpin",
  "email":"Clementina.Treutel@example.org",
  "people":
  {
    "dni":"V13145679",
    "name":"PEOPLE",
    "birthdate":"1992-03-15",
    "mode":"TEACHER",
    "__v":0,
    "_id":"58f182276ab6ee144a716c43",
    "createDate":"2017-04-15T02:15:03.094Z"
  },
  "_id":"58f182276ab6ee144a716c4e",
  "isAdmin":false,
  "dateCreated":"2017-04-15T02:15:03.853Z"
}
```

autenticar Usuario
--------------------

```curl
POST /v1/auth
```

elimina un Usuario de la colección de Usuarios existente

###  Entrada

**username**:string

**password**:string

### Respuesta

```json
{
  "_id": "58d3a3f197d7d509c0efb85b",
  "privateKeyId": "905115d3-d632-482f-aa5e-73d820387fe9",
  "publicKeyId": "NThkMzlmYTA5N2Q3ZDUwOWMwZWZiODU4",
  "ip": "::1",
  "navigator": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/56.0.2924.76 Chrome/56.0.2924.76 Safari/537.36",
  "dateLastConnect": "2017-04-15T02:26:35.288Z",
  "user": {
    "_id": "58d39fa097d7d509c0efb858",
    "username": "root",
    "people": {
      "dni": "E12CE3AE-927A-45A0-A7EF-150F1370587E",
      "name": "ROOT USER",
      "birthdate": "1970-01-01",
      "mode": "TEACHER",
      "_id": "58d39fa097d7d509c0efb859",
      "createDate": "2017-03-23T10:12:48.462Z"
    },
    "__v": 0,
    "isAdmin": true,
    "dateCreated": "2017-03-23T10:12:48.457Z"
  },
  "__v": 0,
  "dateCreated": "2017-03-23T10:31:13.055Z"
}
```

cambiar permisos administrativos
--------------------

```curl
PUT /v1/users/root/:id
```

cambia permisos administrativos de un Usuario

### Parametros

**id**:mongoId

###  Entrada

**isAdmin**:Boolean

### Respuesta

```json
//ejemplo para /v1/users/58f182276ab6ee144a716c4e
{
  "__v":0,
  "username":"Paige.Koelpin",
  "email":"Clementina.Treutel@example.org",
  "people":
  {
    "dni":"V13145679",
    "name":"PEOPLE",
    "birthdate":"1992-03-15",
    "mode":"TEACHER",
    "__v":0,
    "_id":"58f182276ab6ee144a716c43",
    "createDate":"2017-04-15T02:15:03.094Z"
  },
  "_id":"58f182276ab6ee144a716c4e",
  "isAdmin":false,
  "dateCreated":"2017-04-15T02:15:03.853Z"
}
```