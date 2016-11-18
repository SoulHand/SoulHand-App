<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\Subject;

class SubjectDatabaseTest extends DatabaseTestCase
{        
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