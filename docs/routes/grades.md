grados
===================

Crear grado
--------------------

```curl
POST /v1/grades/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade una grado a la colección de grados existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**name**:string

### Respuesta

```json
{ 
	__v: 0, 
	name: '1RO', 
	_id: '58f144eaff7db17ef2c0d420' 
}
```

Obtener todas las grados
--------------------

```curl
GET /v1/grades/	
	
```
obtiene todas las grado existente
### Respuesta

```json
[
	{ 
		__v: 0, 
		name: '1RO', 
		_id: '58f144eaff7db17ef2c0d420' 
	},
	{ 
		__v: 0, 
		name: '2DO', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
]
```
Obtener una grado
--------------------

```curl
GET /v1/grades/:id
	
```
obtiene una grado de la colección de grados existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/grades/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: '2DO', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```

editar una grado
--------------------

```curl
PUT /v1/grades/:id	
```

editar una grado de la colección de grados existente

### Parametros

**id**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
	//ejemplo para /v1/grades/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: '2DO', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```

eliminar una grado
--------------------

```curl
DELETE /v1/grades/:id	
```

elimina una grado de la colección de grados existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/grades/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: '2DO', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```