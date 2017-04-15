Docentes
===================

Crear docentes
--------------------

```curl
POST /v1/people/students/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```

añade un docente a la colección de docentes existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**dni**:string

**name**:string

**birthdate**:string

**tel**:string

**interprete**:Boolean

### Respuesta

```json
{
  "__v":0,
  "data":
    {
      "__v":0,
      "dni":"V19951583",
      "name":"OLE MANN",
      "birthdate":"1992-03-15",
      "tel":"222-408-5717",
      "mode":"TEACHER",
      "_id":"58f17c651f81421145d5a6af",
      "createDate":"2017-04-15T01:50:29.431Z"
    },
  "interprete":true,
  "_id":"58f17c651f81421145d5a6b0"
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/people/students/
  
```
obtiene todas los docentes existente
### Respuesta

```json
[
  {
    "__v":0,
    "data":
      {
        "__v":0,
        "dni":"V19951583",
        "name":"OLE MANN",
        "birthdate":"1992-03-15",
        "tel":"222-408-5717",
        "mode":"TEACHER",
        "_id":"58f17c651f81421145d5a6af",
        "createDate":"2017-04-15T01:50:29.431Z"
      },
    "interprete":true,
    "_id":"58f17c651f81421145d5a6b0"
  },
  {
    "__v":0,
    "data":
      {
        "__v":0,
        "dni":"V19951783",
        "name":"MANI OLES",
        "birthdate":"1992-04-15",
        "tel":"222-407-5717",
        "mode":"TEACHER",
        "_id":"58f17c651f82121145d5a6af",
        "createDate":"2017-04-15T01:50:29.431Z"
      },
    "interprete":false,
    "_id":"58f17c651f81421112d5a6b0"
  }
]
```
Obtener un docente
--------------------

```curl
GET /v1/people/students/
  
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/courses/58f17c651f81421145d5a6b0
{
  "__v":0,
  "data":
    {
      "__v":0,
      "dni":"V19951583",
      "name":"OLE MANN",
      "birthdate":"1992-03-15",
      "tel":"222-408-5717",
      "mode":"TEACHER",
      "_id":"58f17c651f81421145d5a6af",
      "createDate":"2017-04-15T01:50:29.431Z"
    },
  "interprete":true,
  "_id":"58f17c651f81421145d5a6b0"
}
```

editar un docente
--------------------

```curl
PUT /v1/people/students/:id
```

editar un docente de la colección de docentes existente

### Parametros

**id**:mongoId

###  Entrada


**dni**:string

**name**:string

**birthdate**:string

**tel**:string

**interprete**:Boolean

### Respuesta

```json
//ejemplo para /v1/people/students/58f17c651f81421145d5a6b0
{
  "__v":0,
  "data":
    {
      "__v":0,
      "dni":"V19951583",
      "name":"OLE MANN",
      "birthdate":"1992-03-15",
      "tel":"222-408-5717",
      "mode":"TEACHER",
      "_id":"58f17c651f81421145d5a6af",
      "createDate":"2017-04-15T01:50:29.431Z"
    },
  "interprete":true,
  "_id":"58f17c651f81421145d5a6b0"
}
```

eliminar un docente
--------------------

```curl
DELETE /v1/people/students/:id	
```

elimina un docente de la colección de docentes existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/people/students/58f17c651f81421145d5a6b0
{
  "__v":0,
  "data":
    {
      "__v":0,
      "dni":"V19951583",
      "name":"OLE MANN",
      "birthdate":"1992-03-15",
      "tel":"222-408-5717",
      "mode":"TEACHER",
      "_id":"58f17c651f81421145d5a6af",
      "createDate":"2017-04-15T01:50:29.431Z"
    },
  "interprete":true,
  "_id":"58f17c651f81421145d5a6b0"
}
```