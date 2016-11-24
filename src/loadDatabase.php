<?php
require __DIR__ . '/../vendor/autoload.php';
$settings = require __DIR__ . '/BackEnd/settings.php';

echo "Iniciando construcción de la base de datos....\n";
$settings = $settings["settings"]['database'];
$db= new \PDO($settings["connection"],$settings["user"],$settings["password"]);
$SQL_PATH=__DIR__."/database.sql";
$db->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION);
echo "Verificando estado de la base de datos....\n";
if(!file_exists($SQL_PATH)){
    throw new Exception("Falta el archivo en la siguiente ruta : ".$SQL_PATH);                       
}
$SQL=file_get_contents($SQL_PATH);
$db->exec($SQL);
echo "Base de datos cargada exitosamente...\n";