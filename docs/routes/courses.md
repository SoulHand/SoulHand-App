Materias
===================

Crear materia
--------------------

```curl
POST /v1/courses/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade una materia a la colección de materias existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**name**:string

### Respuesta

```json
{ 
	__v: 0, 
	name: 'CASTELLANO', 
	_id: '58f144eaff7db17ef2c0d420' 
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/courses/	
	
```
obtiene todas las materia existente
### Respuesta

```json
[
	{ 
		__v: 0, 
		name: 'CASTELLANO', 
		_id: '58f144eaff7db17ef2c0d420' 
	},
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
]
```
Obtener una materia
--------------------

```curl
GET /v1/courses/:id
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/courses/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```

editar una materia
--------------------

```curl
PUT /v1/courses/:id	
```

editar una materia de la colección de materias existente

### Parametros

**id**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
	//ejemplo para /v1/courses/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```

eliminar una materia
--------------------

```curl
DELETE /v1/courses/:id	
```

elimina una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/courses/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```