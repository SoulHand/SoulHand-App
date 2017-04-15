Altura
===================

Crear altura
--------------------

```curl
POST /v1/physic/static/height/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade una altura a la colección de alturas existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**age**:Number

**min**:Number

**max**:Number

**genero**:Number

### Respuesta

```json
{
	"_id":"58f1692e59c54e0848261e3e",
	"age":11,
	"min":34,
	"max":15,
	"genero":"FEMENINO",
	"__v":0
}

```

Obtener todas las alturas
--------------------

```curl
GET /v1/physic/static/height/	
	
```
obtiene todas las alturas existente
### Respuesta

```json
[
	{
		"_id":"58f1692e59c54e0848261e3e",
		"age":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	},
	{
		"_id":"58f1692e59c54e0848261e3e",
		"age":11,
		"min":25,
		"max":40,
		"genero":"MASCULINO",
		"__v":0
	}
]
```
Obtener una altura
--------------------

```curl
GET /v1/physic/static/height/:id
	
```
obtiene una altura de la colección de alturas existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/physic/static/height/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"age":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```

editar una altura
--------------------

```curl
PUT /v1/physic/static/height/:id	
```

editar una altura de la colección de alturas existente

### Parametros

**id**:mongoId

###  Entrada

**age**:Number

**min**:Number

**max**:Number

**genero**:Number

### Respuesta

```json
	//ejemplo para /v1/physic/static/height/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"age":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```

eliminar una altura
--------------------

```curl
DELETE /v1/physic/static/height/:id	
```

elimina una altura de la colección de alturas existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/physic/static/height/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"age":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```

Anchura
===================

Crear anchura
--------------------

```curl
POST /v1/physic/static/weight/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade una anchura a la colección de anchuras existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**height**:Number

**min**:Number

**max**:Number

**genero**:Number

### Respuesta

```json
{
	"_id":"58f1692e59c54e0848261e3e",
	"height":11,
	"min":34,
	"max":15,
	"genero":"FEMENINO",
	"__v":0
}

```

Obtener todas las anchuras
--------------------

```curl
GET /v1/physic/static/weight/	
	
```
obtiene todas las anchuras existente
### Respuesta

```json
[
	{
		"_id":"58f1692e59c54e0848261e3e",
		"height":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	},
	{
		"_id":"58f1692e59c54e0848261e3e",
		"height":11,
		"min":25,
		"max":40,
		"genero":"MASCULINO",
		"__v":0
	}
]
```
Obtener una anchura
--------------------

```curl
GET /v1/physic/static/weight/:id
	
```
obtiene una anchura de la colección de anchuras existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/physic/static/weight/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"height":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```

editar una anchura
--------------------

```curl
PUT /v1/physic/static/weight/:id	
```

editar una anchura de la colección de anchuras existente

### Parametros

**id**:mongoId

###  Entrada

**height**:Number

**min**:Number

**max**:Number

**genero**:Number

### Respuesta

```json
	//ejemplo para /v1/physic/static/weight/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"height":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```

eliminar una anchura
--------------------

```curl
DELETE /v1/physic/static/weight/:id	
```

elimina una anchura de la colección de anchuras existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/physic/static/weight/58f1692e59c54e0848261e3e
	{
		"_id":"58f1692e59c54e0848261e3e",
		"height":11,
		"min":15,
		"max":34,
		"genero":"FEMENINO",
		"__v":0
	}
```