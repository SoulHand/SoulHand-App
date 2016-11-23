<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\Student;

class CreateStudentTest extends DatabaseTestCase
{
    public function testInsertTrue()
    {
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$faker->regexify('/[VE][0-9]{6,10}/'),
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->date('d-m-Y'),
            "phone"=>$faker->phoneNumber,
            "email"=>$faker->email,
            "deafness"=>$faker->numberBetween(10,20),
            "cod_institute"=>'0'
        ];
        $people=new Student($this->database);
        $search=$people->create($data);
        $this->assertEquals($search["alumno_cedula"],$data["dni"]);        
        $this->assertEquals($search["persona_nombre"],$data["first_name"]);     
        $this->assertEquals($search["persona_apellido"],$data["last_name"]);
        $datetime = \DateTime::createFromFormat('d-m-Y', $data["birthdate"]);  
        $this->assertEquals($search["persona_fecha_nacimiento"],$datetime->format('Y-m-d'));
        $this->assertEquals($search["persona_telefono"],$data["phone"]);        
        $this->assertEquals($search["persona_correo"],$data["email"]);
        $now=$people->find($data["dni"]);
        $this->assertEquals($now["grado_sordera"],$data["deafness"]);
        $this->assertEquals($now["institucion_institucion_cod"],$data["cod_institute"]);
    }
    public function testInsertDuplicated(){
        $people=$this->insertPeople();
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$people["persona_cedula"],
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->date('d-m-Y'),
            "phone"=>$faker->phoneNumber,
            "email"=>$faker->email,
            "deafness"=>$faker->numberBetween(10,20),
            "cod_institute"=>'0'
        ];
        $people=new Student($this->database);
        $this->expectException(\PDOException::class);
        $people->create($data);
    }
    public function testDeleteStudent(){
        $faker = Factory::create("es_ES");
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$faker->regexify('/[VE][0-9]{6,10}/'),
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->date('d-m-Y'),
            "phone"=>$faker->phoneNumber,
            "email"=>$faker->email,
            "deafness"=>$faker->numberBetween(10,20),
            "cod_institute"=>'0'
        ];
        $people=new Student($this->database);
        $search=$people->create($data);
        $people->delete($search["alumno_cedula"]);
        $now=$this->searchUser($search["alumno_cedula"]);
        $this->assertFalse($now);
        $this->expectException(\PDOException::class);
        $now=$people->find($search["alumno_cedula"]);
    }
    public function testUpdate(){
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$faker->regexify('/[VE][0-9]{6,10}/'),
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->date('d-m-Y'),
            "phone"=>$faker->phoneNumber,
            "email"=>$faker->email,
            "deafness"=>$faker->numberBetween(10,20),
            "cod_institute"=>'0'
        ];
        $people=new Student($this->database);
        $search=$people->create($data);
        $insert=[
            "grado_sordera"=>'50'
        ];
        $people->update($search["alumno_cedula"],$insert);
        $now=$people->find($search["alumno_cedula"]);
        $this->assertNotEquals($insert["grado_sordera"],$data["deafness"]);
    }
}