Dominios/Niveles del aprendizaje
===================

Crear Dominios
--------------------

```curl
POST /v1/learning/domain/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade un Dominio a la colección de Dominios existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**name**:string

**description**:string

### Respuesta

```json
{
	"_id": "58d3a54397d7d509c0efb862",
	"name": "AFECTIVO",
	"__v": 1,
	"words": [],
	"cognitions": [
	  {
	    "_id": "58d67a2ddefd980ca6551dfd",
	    "description": "DISMINUIR EL IMPACTO DE SUCESOS NEGATIVOS O FRUSTRANTES A TRAVÉS DE COGNICIONES",
	    "name": "PENSAMIENTO RETROSPECTIVO",
	    "words": []
	  }
	]
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/learning/domain/
	
```
obtiene todas los Dominios existente
### Respuesta

```json
[
  {
    "_id": "58d3a54397d7d509c0efb862",
    "name": "AFECTIVO",
    "__v": 1,
    "words": [],
    "cognitions": [
      {
        "_id": "58d67a2ddefd980ca6551dfd",
        "description": "DISMINUIR EL IMPACTO DE SUCESOS NEGATIVOS O FRUSTRANTES A TRAVÉS DE COGNICIONES",
        "name": "PENSAMIENTO RETROSPECTIVO",
        "words": []
      }
    ]
  },
  {
    "_id": "58d3a55297d7d509c0efb864",
    "name": "PSICOMOTOR",
    "__v": 4,
    "words": [],
    "cognitions": [
      {
        "_id": "58d66cbd4f5ba809f861559c",
        "description": "CAPACIDAD DE REALIZAR UN MOVIMIENTO O GESTO SIMPLE DE MANERA INTENCIONADA",
        "name": "PRAXIAS IDEOMOTORAS",
        "words": []
      },
      {
        "_id": "58d66cd94f5ba809f861559e",
        "description": "CAPACIDAD PARA MANIPULAR OBJETOS MEDIANTE UNA SECUENCIA DE GESTOS, LO QUE IMPLICA EL CONOCIMIENTO DE LA FUNCIÓN DEL OBJETO, EL CONOCIMIENTO DE LA ACCIÓN Y EL CONOCIMIENTO DEL ORDEN SERIAL DE LOS ACTOS QUE LLEVAN A ESA ACCIÓN",
        "name": "PRAXIAS IDEATORIAS",
        "words": []
      },
      {
        "_id": "58d66cf64f5ba809f86155a0",
        "description": "CAPACIDAD DE REALIZAR DE MANERA VOLUNTARIA MOVIMIENTOS O GESTOS CON DIVERSAS PARTES DE LA CARA: LABIOS, LENGUA, OJOS, CEJAS, CARRILLOS, ETC",
        "name": "PRAXIAS FACIALES",
        "words": []
      },
      {
        "_id": "58d66d0e4f5ba809f86155a2",
        "description": "CAPACIDAD DE PLANIFICAR Y REALIZAR LOS MOVIMIENTOS NECESARIOS PARA ORGANIZAR UNA SERIE DE ELEMENTOS EN EL ESPACIO PARA FORMAR UN DIBUJO O FIGURA FINAL",
        "name": "PRAXIAS VISOCONSTRUCTIVAS",
        "words": []
      }
    ]
  }
]
```
Obtener un Dominio
--------------------

```curl
GET /v1/learning/domain/
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/courses/58f144eaff7db17ef2c0d421
	{
		"_id": "58d3a54397d7d509c0efb862",
		"name": "AFECTIVO",
		"__v": 1,
		"words": [],
		"cognitions": [
		  {
		    "_id": "58d67a2ddefd980ca6551dfd",
		    "description": "DISMINUIR EL IMPACTO DE SUCESOS NEGATIVOS O FRUSTRANTES A TRAVÉS DE COGNICIONES",
		    "name": "PENSAMIENTO RETROSPECTIVO",
		    "words": []
		  }
		]
	}
```

editar un Dominio
--------------------

```curl
PUT /v1/learning/domain/:id
```

editar un Dominio de la colección de Dominios existente

### Parametros

**id**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
	//ejemplo para /v1/domain/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```

eliminar un Dominio
--------------------

```curl
DELETE /v1/learning/domain/:id	
```

elimina un Dominio de la colección de Dominios existente

### Parametros

**id**:mongoId

### Respuesta

```json
	//ejemplo para /v1/domain/58f144eaff7db17ef2c0d421
	{ 
		__v: 0, 
		name: 'MATEMÁTICA', 
		_id: '58f144eaff7db17ef2c0d421' 
	}
```