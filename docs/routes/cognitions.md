Funciones Cognitivas
===================

Crear Funciones Cognitivas
--------------------

```curl
POST /v1/knowedge/:domain/cognitions/?PublicKeyId=:publickeyId&PrivateKeyId=:privateKeyId	
	
```
añade un Funciones Cognitiva a la colección de Funciones Cognitivas existente

### Parametros

**publickeyId**:string

**privateKeyId**:string

###  Entrada

**name**:string

**description**:string

### Respuesta

```json
{
  "_id": "58d67a2ddefd980ca6551dfd",
  "description": "DISMINUIR EL IMPACTO DE SUCESOS NEGATIVOS O FRUSTRANTES A TRAVÉS DE COGNICIONES",
  "name": "PENSAMIENTO RETROSPECTIVO",
  "words": []
}
```

Obtener todas las materias
--------------------

```curl
GET /v1/knowedge/:domain/cognitions/
	
```
obtiene todas los Funciones Cognitivas existente
### Respuesta

```json
[
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
```
Obtener un Funciones Cognitiva
--------------------

```curl
GET /v1/knowedge/:domain/cognitions/
	
```
obtiene una materia de la colección de materias existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/courses/58d66cbd4f5ba809f861559c
{
  "_id": "58d66cbd4f5ba809f861559c",
  "description": "CAPACIDAD DE REALIZAR UN MOVIMIENTO O GESTO SIMPLE DE MANERA INTENCIONADA",
  "name": "PRAXIAS IDEOMOTORAS",
  "words": []
}
```

editar un Funciones Cognitiva
--------------------

```curl
PUT /v1/knowedge/:domain/cognitions/:id
```

editar un Funciones Cognitiva de la colección de Funciones Cognitivas existente

### Parametros

**id**:mongoId

###  Entrada

**name**:string

### Respuesta

```json
//ejemplo para /v1/domain/58d66cbd4f5ba809f861559c
{
  "_id": "58d66cbd4f5ba809f861559c",
  "description": "CAPACIDAD DE REALIZAR UN MOVIMIENTO O GESTO SIMPLE DE MANERA INTENCIONADA",
  "name": "PRAXIAS IDEOMOTORAS",
  "words": []
}
```

eliminar un Funciones Cognitiva
--------------------

```curl
DELETE /v1/knowedge/:domain/cognitions/:id	
```

elimina un Funciones Cognitiva de la colección de Funciones Cognitivas existente

### Parametros

**id**:mongoId

### Respuesta

```json
//ejemplo para /v1/domain/58d66cbd4f5ba809f861559c
{
  "_id": "58d66cbd4f5ba809f861559c",
  "description": "CAPACIDAD DE REALIZAR UN MOVIMIENTO O GESTO SIMPLE DE MANERA INTENCIONADA",
  "name": "PRAXIAS IDEOMOTORAS",
  "words": []
}
```