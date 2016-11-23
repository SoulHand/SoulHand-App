<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\Teacher;

class CreateTeacherTest extends DatabaseTestCase
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
            "instruction"=>$faker->jobTitle,
            "interpreter"=>$faker->regexify('/(CERTIFICADO|USUARIO|N\/A)/')
        ];
        $people=new Teacher($this->database);
        $search=$people->create($data);
        $this->assertEquals($search["persona_cedula"],$data["dni"]);        
        $this->assertEquals($search["persona_nombre"],$data["first_name"]);     
        $this->assertEquals($search["persona_apellido"],$data["last_name"]);        
        $this->assertEquals($search["persona_fecha_nacimiento"],$data["birthdate"]);
        $this->assertEquals($search["persona_telefono"],$data["phone"]);        
        $this->assertEquals($search["persona_correo"],$data["email"]);
        $now=$people->find($data["dni"]);
        $this->assertEquals($now["docente_instruccion"],$data["instruction"]);        
        $this->assertEquals($now["docente_interprete"],$data["interpreter"]);        
    }
    public function testInsertDuplicated(){
        $people=$this->insertPeople();
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$people["persona_cedula"],
            "first_name"=>$people["persona_nombre"],
            "last_name"=>$people["persona_apellido"],
            "birthdate"=>$people["persona_fecha_nacimiento"],
            "phone"=>$people["persona_telefono"],
            "email"=>$people["persona_correo"],
            "password"=>$faker->password,
            "username"=>$faker->username
        ];
        $user=new Teacher($this->database);
        $this->expectException(\PDOException::class);
        $user->create($data);        
    }
    public function testDeleteTeacher(){
        $faker = Factory::create("es_ES");
        $data=[
            "dni"=>$faker->regexify('/[VE][0-9]{6,10}/'),
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->date('d-m-Y'),
            "phone"=>$faker->phoneNumber,
            "email"=>$faker->email,
            "instruction"=>$faker->jobTitle,
            "interpreter"=>$faker->regexify('/(CERTIFICADO|USUARIO|N\/A)/')
        ];
        $people=new Teacher($this->database);
        $search=$people->create($data);
        $people->delete($search["persona_cedula"]);
        $now=$this->searchUser($search["persona_cedula"]);
        $this->assertFalse($now);
        $this->expectException(\PDOException::class);
        $now=$people->find($search["persona_cedula"]);
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
            "instruction"=>$faker->jobTitle,
            "interpreter"=>$faker->regexify('/(CERTIFICADO|USUARIO|N\/A)/')
        ];
        $people=new Teacher($this->database);
        $search=$people->create($data);
        $insert=[
            "docente_instruccion"=>'FUERA DE SERVICIO'
        ];
        $people->update($search["persona_cedula"],$insert);        
        $now=$people->find($search["persona_cedula"]);
        $this->assertNotEquals($insert["docente_instruccion"],$data["instruction"]);
    }
}