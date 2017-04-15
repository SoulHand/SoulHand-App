Alumnos
===================

Crear Alumnos
--------------------

```curl
POST /v1/people/students/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```

añade un Alumno a la colección de Alumnos existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**dni**:string

**name**:string

**birthdate**:string

**tel**:string

**grade**:string

**parent**:string

### Respuesta

```json
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[],
  "discapacityLevel":0
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/people/students/
	
```
obtiene todas los Alumnos existente
### Respuesta

```json
[
  {
    "__v":0,
    "data":
      {
        "__v":0,
        "name":"WADE LOCKMAN",
        "birthdate":"1992-03-15",
        "tel":"384-758-6384",
        "mode":"STUDENT",
        "dni":"V13145679-1492221385518",
        "_id":"58f17dc94c67041232984cb4",
        "createDate":"2017-04-15T01:56:25.525Z"
      },
    "_id":"58f17dc94c67041232984cb5",
    "objetives":[],
    "physics":[],
    "discapacityLevel":0
  },
  {
    "__v":0,
    "data":
      {
        "__v":0,
        "name":"WADE LOCKMAN",
        "birthdate":"1992-03-15",
        "tel":"384-758-6384",
        "mode":"STUDENT",
        "dni":"V13145679-1492221385518",
        "_id":"58f17dc94c67041232984db4",
        "createDate":"2017-04-15T01:56:25.525Z"
      },
    "_id":"58f17dc94c67041232984dc5",
    "objetives":[],
    "physics":[],
    "discapacityLevel":0
  }
]
```
Obtener un Alumno
--------------------

```curl
GET /v1/people/students/
	
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
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[],
  "discapacityLevel":0
}
```

editar un Alumno
--------------------

```curl
PUT /v1/people/students/:id
```

editar un Alumno de la colección de Alumnos existente

### Parametros

**id**:mongoId

###  Entrada


**dni**:string

**name**:string

**birthdate**:string

**tel**:string

**grade**:string

**parent**:string

### Respuesta

```json
//ejemplo para /v1/people/students/58f144eaff7db17ef2c0d421
{
  "__v":0,
  "data":
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[],
  "discapacityLevel":0
}
```

eliminar un Alumno
--------------------

```curl
DELETE /v1/people/students/:id  
```

elimina un Alumno de la colección de Alumnos existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/people/students/58f144eaff7db17ef2c0d421
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[],
  "discapacityLevel":0
}
```

añadir un desarrollo físico
--------------------

```curl
POST /v1/people/students/:id/physic
```

añade un registro al historico de desarrollo físico del alumno

### Parametros

**id**:mongoId

###  Entrada


**height**:Number

**weight**:Number

### Respuesta

```json
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[
      { 
        height: 23.43,
        weight: 33,
        age: 24,
        _id: '58f242b5d8589f4cb2d3ef67',
        date: '2017-04-15T15:56:37.838Z' 
      },
      { 
        _id: '58f242b6d8589f4cb2d3ef72',
        age: 25.103189958491882,
        height: 12.3,
        weight: 40,
        date: '2017-04-15T15:56:38.532Z' 
      }
  ],
  "discapacityLevel":0
}
```

eliminar un desarrollo físico
--------------------

```curl
POST /v1/people/students/:id/physic/:del
```

elimina un registro al historico de desarrollo físico del alumno

### Parametros

**id**:mongoId

**del**:mongoId

###  Entrada

### Respuesta

```json
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[
      { 
        height: 23.43,
        weight: 33,
        age: 24,
        _id: '58f242b5d8589f4cb2d3ef67',
        date: '2017-04-15T15:56:37.838Z' 
      }
  ],
  "discapacityLevel":0
}
```

evaluar el nivel de audicion
--------------------

```curl
PUT /v1/people/students/:id/sound/test
```

Evalua el nivel de audición y genera resultados del aprendizaje

### Parametros

**id**:mongoId

###  Entrada

**value**:Array<Number> de 5 elementos

### Respuesta

```json
{
  "__v":0,
  "data":
    {
      "__v":0,
      "name":"WADE LOCKMAN",
      "birthdate":"1992-03-15",
      "tel":"384-758-6384",
      "mode":"STUDENT",
      "dni":"V13145679-1492221385518",
      "_id":"58f17dc94c67041232984cb4",
      "createDate":"2017-04-15T01:56:25.525Z"
    },
  "_id":"58f17dc94c67041232984cb5",
  "objetives":[],
  "physics":[
      { 
        height: 23.43,
        weight: 33,
        age: 24,
        _id: '58f242b5d8589f4cb2d3ef67',
        date: '2017-04-15T15:56:37.838Z' 
      }
  ],
  "discapacityLevel":35.57689666748047
}
```

