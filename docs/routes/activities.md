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

asignar objetivos a una actividades
--------------------

```curl
POST /v1/activities/:grade/:course/:id/:domain/objetives/:level/:objetive	
	
```
añade un actividad a la colección de actividades existente

### Parametros

**grade**: string

**course**: string

**id**: mongoId

**domain**: string

**level**: string

**objetive**: mongoId

### Respuesta

```json
{ 
  _id: '58f5ebbb0d9ca33a2845679f',
  name: 'MARLEN HEANEY',
  description: 'ACTIVIDAD',
  dateExpire: '2017-04-18T10:34:35.396Z',
  teacher: '58f5ebbb0d9ca33a28456799',
  grade: { name: 'NATHEN CONNELLY', _id: '58f5ebbb0d9ca33a28456796' },
  course: { name: 'KADE KOVACEK', _id: '58f5ebbb0d9ca33a28456795' },
  __v: 1,
  students: [],
  dateCreated: '2017-04-18T10:34:35.396Z',
  isCompleted: false,
  objetives: 
  [ 
    { 
      __v: 0,
      description: 'HOLA',
      name: 'FRANCESCO REYNOLDS',
      _id: '58f5ebbb0d9ca33a284567a4',
      words: [],
      dateCreated: '2017-04-18T10:34:35.402Z',
      cognitions: [],
      level: [Object],
      domain: [Object]
    } 
  ] 
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