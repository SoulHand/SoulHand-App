<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\Subject;

class SubjectDatabaseTest extends DatabaseTestCase
{    
    public function searchSubject($id){
    	$stm=$this->database->query("SELECT * FROM materia WHERE materia_cod={$id}");
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
    public function testCreateSubjectTrue()
    {
    	$faker = Factory::create("es_ES");
    	$class=new Subject($this->database);
    	$data=[
    		"subject_name"=>$faker->text(45)
    	];
    	$Id=$class->create($data);
    	$content=$this->searchSubject($Id);
    	$this->asserEquals($data["subject_name"],$content["materia_nombre"]);
    }
    public function testCreateDuplicate(){
        $subject=$this->insertSubject();
        $class=new Subject($this->database);
        $this->expectException(\PDOException::class);
        $Id=$class->create($subject);
    }
}