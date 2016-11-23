<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \Faker\Factory;

class DatabaseTestCase extends \Tests\Functional\BaseTestCase
{
	protected $database;
    /**
     * Test that the index route returns a rendered response containing the text 'SlimFramework' but not a greeting
     */
    public function setUp(){
        $settings = require __DIR__ . '/../../../src/BackEnd/settings.php';
        $settings=$settings["settings"];
        $SQL_PATH=__DIR__."/../../../src/database.sql";
        $this->database=new \PDO($settings["test_database"]["connection"],$settings["test_database"]["user"],$settings["test_database"]["password"]);
        $this->database->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION);
        if(!file_exists($SQL_PATH)){
            throw new Exception("Falta el archivo en la siguiente ruta : ".$SQL_PATH);                       
        }
        $SQL=file_get_contents($SQL_PATH);
    	$this->database->exec($SQL);
    }
    public function tearDown(){
        $stm=$this->database->query("SHOW TABLES");
        while($table=$stm->fetch(\PDO::FETCH_NUM)){
            $this->database->exec("DROP TABLE {$table[0]}");
        }
    }
    public function searchSubject($id){
        $stm=$this->database->query("SELECT * FROM materia WHERE materia_cod='{$id}'");
        return $stm->fetch(\PDO::FETCH_ASSOC);
    }
    public function searchPeople($id){
        $stm=$this->database->query("SELECT * FROM persona WHERE persona_cedula='{$id}'");
        return $stm->fetch(\PDO::FETCH_ASSOC);
    }
    public function searchUser($id){
        $stm=$this->database->query("SELECT * FROM usuario WHERE persona_cedula='{$id}'");      
        return $stm->fetch(\PDO::FETCH_ASSOC);
    }
    public function insertSubject(){
        $faker = Factory::create("es_ES");
        $data=[
            "materia_nombre"=>$faker->text(45)
        ];
        $stm=$this->database->prepare("INSERT INTO materia (materia_nombre) VALUES(:materia_nombre)");
        $query=$stm->execute($data);
        if(!$query){
            throw new Exception("Error insertando materia!");            
        }
        $data["materia_cod"]=$this->database->lastInsertId();
        return $data;
    }
    public function insertPeople(){
        $faker = Factory::create("es_ES");
        //$faker->seed(1234);
        $data=[
            "persona_cedula"=>$faker->regexify('/[VE][0-9]{6,10}/'),
            "persona_nombre"=>$faker->firstName,
            "persona_apellido"=>$faker->lastName,
            "persona_telefono"=>$faker->phoneNumber,
            "persona_fecha_nacimiento"=>$faker->date('Y-m-d'),
            "persona_correo"=>$faker->email,
            "persona_imagen"=>NULL
        ];
        $stm=$this->database->prepare("
            INSERT INTO persona (
                persona_cedula,
                persona_nombre,
                persona_apellido,
                persona_telefono,
                persona_fecha_nacimiento,
                persona_correo,
                persona_imagen
            ) 
            VALUES(
                :persona_cedula,
                :persona_nombre,
                :persona_apellido,
                :persona_telefono,
                :persona_fecha_nacimiento,
                :persona_correo,
                :persona_imagen
            )
        ");
        $query=$stm->execute($data);
        if(!$query){
            throw new Exception("Error insertando persona!");            
        }
        return $data;
    }
    public function insertUser($cedula,$role='ALUMNO'){
        $faker = Factory::create("es_ES");
        $data=[
            "persona_cedula"=>$cedula,
            "usuario_nombre"=>$faker->userName,
            "usuario_contrasena"=>$faker->password,
            "usuario_role"=>$role
        ];
        $stm=$this->database->prepare("
            INSERT INTO usuario (
                persona_cedula,
                usuario_nombre,
                usuario_contrasena,
                usuario_role
            ) 
            VALUES(
                :persona_cedula,
                :usuario_nombre,
                :usuario_contrasena,
                :usuario_role
            )
        ");
        $query=$stm->execute($data);
        if(!$query){
            throw new Exception("Error insertando persona!");            
        }
        return $data;
    }
}