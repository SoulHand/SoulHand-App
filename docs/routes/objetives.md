Objetivos especificos de aprendizaje
===================

Crear objetivos
--------------------

```curl
POST /v1/knowedge/:domain/objetives/:level/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId 
  
```
añade un objetivo a la colección de objetivos existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

**domain**:string => nombre dominio

**level**:string => nombre nivel

###  Entrada

**name**:string

**description**:string

### Respuesta

```json
{ __v: 0,
  name: 'CORRER 200 MTS',
  description: 'ALCANZAR LOS 200MTS SIN PARAR',
  _id: '58f4d134dd693661c7f7d8eb',
  words: [],
  dateCreated: '2017-04-17T14:29:08.278Z',
  cognitions: [],
  level: { 
    _id: '58f4d133dd693661c7f7d8e3', 
    name: 'CONOCER'
  },
  domain: { 
    _id: '58f4d133dd693661c7f7d8e4',
    name: 'COGNITIVO'
  } 
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/knowedge/:domain/objetives/:level/
  
```


### Parametros

**publickeyId**:string

**privateKeyId**:string

**domain**:string => nombre dominio

**level**:string => nombre nivel

obtiene todas los objetivos existente
### Respuesta

```json
[
  { __v: 0,
    name: 'CORRER 200 MTS',
    description: 'ALCANZAR LOS 200MTS SIN PARAR',
    _id: '58f4d134dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  },
  { __v: 0,
    name: 'CORRER 100 MTS',
    description: 'ALCANZAR LOS 100MTS SIN PARAR',
    _id: '58f4d131dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  }
]
```
Obtener un objetivo
--------------------

```curl
GET /v1/knowedge/:domain/objetives/:level/
  
```
obtiene una materia de la colección de materias existente

### Parametros

**domain**:string => nombre dominio

**level**:string => nombre nivel

**id**:mongoId

### Respuesta

```json
{ __v: 0,
    name: 'CORRER 100 MTS',
    description: 'ALCANZAR LOS 100MTS SIN PARAR',
    _id: '58f4d131dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  }
```

editar un objetivo
--------------------

```curl
PUT /v1/knowedge/:domain/objetives/:level/:id
```

### Parametros

**domain**:string => nombre dominio

**level**:string => nombre nivel

editar un objetivo de la colección de objetivos existente

### Parametros

**id**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
{ __v: 0,
    name: 'CORRER 100 MTS',
    description: 'ALCANZAR LOS 100MTS SIN PARAR',
    _id: '58f4d131dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  }
```


añadir una funcion cognitiva a un objetivo
--------------------

```curl
PUT /v1/knowedge/:domain/objetives/:level/:id/cognitions/:cognition
```

### Parametros

**domain**:string => nombre dominio

**level**:string => nombre nivel

añade una funcion cognitiva a un objetivo de la colección de objetivos existente

### Parametros

**id**:mongoId

**domain**:string

**level**:string

**id**:string

**cognition**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
{ __v: 0,
    name: 'CORRER 100 MTS',
    description: 'ALCANZAR LOS 100MTS SIN PARAR',
    _id: '58f4d131dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  }
```

eliminar un objetivo
--------------------

```curl
DELETE /v1/knowedge/:domain/objetives/:level/:id	
```

elimina un objetivo de la colección de objetivos existente


### Parametros

**domain**:string => nombre dominio

**level**:string => nombre nivel

**id**:mongoId

### Respuesta

```json
{ __v: 0,
    name: 'CORRER 100 MTS',
    description: 'ALCANZAR LOS 100MTS SIN PARAR',
    _id: '58f4d131dd693661c7f7d8eb',
    words: [],
    dateCreated: '2017-04-17T14:29:08.278Z',
    cognitions: [],
    level: { 
      _id: '58f4d133dd693661c7f7d8e3', 
      name: 'CONOCER'
    },
    domain: { 
      _id: '58f4d133dd693661c7f7d8e4',
      name: 'COGNITIVO'
    } 
  }
```