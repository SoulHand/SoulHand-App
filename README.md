Aplicación SoulHand
=============================

Herramienta bajo entorno web para personas con discapacidad auditiva y sorda para la interpretación de lengua de señas venezolana (LSV)

## Formar parte del desarrollo
	
Puedes clonar este proyecto para usarlo con git libremente usa el siguiente comando.

	$ git clone https://github.com/SoulHand/SoulHand-App.git

## Instalar la aplicación

Ejecute este comando para crear una nueva aplicación Slim Framework.

```bash
	$ php composer.phar create-project slim/slim-skeleton SoulHand-App
```
Dependencias
```bash
	$ npm install
	$ bower install
	$ typings install
	$ composer install
```

Compilar el proyecto cliente TypeScript + React

	webpack
	# o sino
	npm run compilar

El resultado de la compilación se puede usar en public/js/build.js. 

Para ejecutar esta aplicación en modo producción puede usar el siguiente comando. 
```bash
	$ php composer.phar start
```	

Ejecute este comando para hacer las pruebas
```bash
	$ php composer.phar test
```

