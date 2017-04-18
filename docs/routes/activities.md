actividades
===================

Crear actividades
--------------------

```curl
POST /v1/activities/:grade/:course/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade un actividad a la colección de actividades existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**name**:string

**description**:string

### Respuesta

```json
{ __v: 0,
  name: 'contar y jugar',
  description: 'contar del 1 al 10 mientras canta y baila',
  dateExpire: '2016-03-15T23:04:12.000Z',
  teacher: '58f56d275dd49d18993ae36d',
  grade:{ 
    name: '1RO',
    __v: 0,
    _id: '58f56d275dd49d18993ae36b' 
  },
  course: { 
    name: 'LOREN YUNDT',
    __v: 0,
    _id: '58f56d275dd49d18993ae36a'
  },
  _id: '58f56d285dd49d18993ae379',
  student: [],
  dateCreated: '2017-04-18T01:34:32.668Z',
  isCompleted: false,
  objetives: [] 
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/activities/:grade/:course/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId
	
```
obtiene todas los actividades existente
### Respuesta

```json
[
  { __v: 0,
    name: 'contar y jugar',
    description: 'contar del 1 al 10 mientras canta y baila',
    dateExpire: '2016-03-15T23:04:12.000Z',
    teacher: '58f56d275dd49d18993ae36d',
    grade:{ 
      name: '1RO',
      __v: 0,
      _id: '58f56d275dd49d18993ae36b' 
    },
    course: { 
      name: 'LOREN YUNDT',
      __v: 0,
      _id: '58f56d275dd49d18993ae36a'
    },
    _id: '58f56d285dd49d18993ae379',
    student: [],
    dateCreated: '2017-04-18T01:34:32.668Z',
    isCompleted: false,
    objetives: [] 
  }
]
```
Obtener un actividad
--------------------

```curl
GET /v1/activities/:grade/:course/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/courses/58d66cbd4f5ba809f861559c
{ __v: 0,
  name: 'contar y jugar',
  description: 'contar del 1 al 10 mientras canta y baila',
  dateExpire: '2016-03-15T23:04:12.000Z',
  teacher: '58f56d275dd49d18993ae36d',
  grade:{ 
    name: '1RO',
    __v: 0,
    _id: '58f56d275dd49d18993ae36b' 
  },
  course: { 
    name: 'LOREN YUNDT',
    __v: 0,
    _id: '58f56d275dd49d18993ae36a'
  },
  _id: '58f56d285dd49d18993ae379',
  student: [],
  dateCreated: '2017-04-18T01:34:32.668Z',
  isCompleted: false,
  objetives: [] 
}

```
eliminar un actividad
--------------------

```curl
DELETE /v1/activities/:grade/:course/:id?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
```

elimina un actividad de la colección de actividades existente

### Parametros

**id**:mongoId

### Respuesta

```json
{ __v: 0,
  name: 'contar y jugar',
  description: 'contar del 1 al 10 mientras canta y baila',
  dateExpire: '2016-03-15T23:04:12.000Z',
  teacher: '58f56d275dd49d18993ae36d',
  grade:{ 
    name: '1RO',
    __v: 0,
    _id: '58f56d275dd49d18993ae36b' 
  },
  course: { 
    name: 'LOREN YUNDT',
    __v: 0,
    _id: '58f56d275dd49d18993ae36a'
  },
  _id: '58f56d285dd49d18993ae379',
  student: [],
  dateCreated: '2017-04-18T01:34:32.668Z',
  isCompleted: false,
  objetives: [] 
}
```