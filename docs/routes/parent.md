Representantes
===================

Crear Representantes
--------------------

```curl
POST /v1/people/parents/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```

añade un Representante a la colección de Representantes existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**dni**:string

**name**:string

**birthdate**:string

**tel**:string

### Respuesta

```json
{
  "__v":0,
  "data":
  {
    "__v":0,
    "dni":"V80923203",
    "name":"FLAVIO HUELS",
    "birthdate":"1992-03-15",
    "tel":"542-845-5465",
    "mode":"PARENT",
    "_id":"58f172f49be9310c176f7a07",
    "createDate":"2017-04-15T01:10:12.603Z"
  },
  "_id":"58f172f49be9310c176f7a08",
  "students":[]
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/people/parents/
	
```
obtiene todas los Representantes existente
### Respuesta

```json
[
  {
    "__v":0,
    "data":
    {
      "__v":0,
      "dni":"V80923203",
      "name":"FLAVIO HUELS",
      "birthdate":"1992-03-15",
      "tel":"542-845-5465",
      "mode":"PARENT",
      "_id":"58f172f49be9310c176f7a07",
      "createDate":"2017-04-15T01:10:12.603Z"
    },
    "_id":"58f172f49be9310c176f7a08",
    "students":[]
  },
  {
  "__v":0,
    "data":
    {
      "__v":0,
      "dni":"V80923205",
      "name":"HUMBERTO PEREZ",
      "birthdate":"1992-04-21",
      "tel":"542-847-5465",
      "mode":"PARENT",
      "_id":"58f172f49be9310c173f7a01",
      "createDate":"2017-04-15T01:10:12.603Z"
    },
    "_id":"58f172f49be9310c176f7a09",
    "students":[]
  }
]
```
Obtener un Representante
--------------------

```curl
GET /v1/people/parents/
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/courses/58f144eaff7db17ef2c0d421
{
  "__v":0,
  "data":
  {
    "__v":0,
    "dni":"V80923203",
    "name":"FLAVIO HUELS",
    "birthdate":"1992-03-15",
    "tel":"542-845-5465",
    "mode":"PARENT",
    "_id":"58f172f49be9310c176f7a07",
    "createDate":"2017-04-15T01:10:12.603Z"
  },
  "_id":"58f172f49be9310c176f7a08",
  "students":[]
}
```

editar un Representante
--------------------

```curl
PUT /v1/people/parents/:id
```

editar un Representante de la colección de Representantes existente

### Parametros

**id**:mongoId

###  Entrada


**dni**:string

**name**:string

**birthdate**:string

**tel**:string


### Respuesta

```json
//ejemplo para /v1/people/parents/58f144eaff7db17ef2c0d421
{
  "__v":0,
  "data":
  {
    "__v":0,
    "dni":"V80923203",
    "name":"FLAVIO HUELS",
    "birthdate":"1992-03-15",
    "tel":"542-845-5465",
    "mode":"PARENT",
    "_id":"58f172f49be9310c176f7a07",
    "createDate":"2017-04-15T01:10:12.603Z"
  },
  "_id":"58f172f49be9310c176f7a08",
  "students":[]
}
```

eliminar un Representante
--------------------

```curl
DELETE /v1/people/parents/:id	
```

elimina un Representante de la colección de Representantes existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/people/parents/58f144eaff7db17ef2c0d421
{
  "__v":0,
  "data":
  {
    "__v":0,
    "dni":"V80923203",
    "name":"FLAVIO HUELS",
    "birthdate":"1992-03-15",
    "tel":"542-845-5465",
    "mode":"PARENT",
    "_id":"58f172f49be9310c176f7a07",
    "createDate":"2017-04-15T01:10:12.603Z"
  },
  "_id":"58f172f49be9310c176f7a08",
  "students":[]
}
```