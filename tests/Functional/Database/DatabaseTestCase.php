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
        $stm=$this->database->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        while($table=$stm->fetch(\PDO::FETCH_NUM)){
            $this->database->exec("DROP TABLE {$table[0]}");
        }
    }
}