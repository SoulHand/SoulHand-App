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
    	$this->assertEquals($data["subject_name"],$content["materia_nombre"]);
    }
    public function testCreateDuplicate(){
        $subject=$this->insertSubject();
        $data=[
            "subject_name"=>$subject["materia_nombre"]
        ];
        $class=new Subject($this->database);
        $this->expectException(\PDOException::class);
        $Id=$class->create($data);
    }
    public function testFindTrue(){
        $subject=$this->insertSubject();
        $class=new Subject($this->database);        
        $search=$class->find($subject["materia_cod"]);
        $this->assertEquals($subject["materia_nombre"],$search["materia_nombre"]);
    }
    public function testDelete(){
        $subject=$this->insertSubject();
        $class=new Subject($this->database);        
        $class->delete($subject["materia_cod"]);
        $content=$this->searchSubject($subject["materia_cod"]);
        $this->assertFalse($content);
    }
    public function testUpdate(){
        $faker = Factory::create("es_ES");
        $subject=$this->insertSubject();
        $edit=[
            "materia_nombre"=>$faker->text(40)
        ];
        $class=new Subject($this->database);        
        $class->update($subject["materia_cod"],$edit);
        $content=$this->searchSubject($subject["materia_cod"]);
        $this->assertEquals($content["materia_nombre"],$edit["materia_nombre"]);
    }
}