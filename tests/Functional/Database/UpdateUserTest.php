<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\User;
use \SoulHand\Academic\People;

class UpdateUserTest extends DatabaseTestCase
{
    public function setUp(){
        Parent::setUp();
        $faker = Factory::create("es_ES");
        //$faker->seed(1234);
        $data=[
            "persona_cedula"=>'123',
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
    }
    public function testUpdateUser(){
        $faker = Factory::create("es_ES");
        $people= new People($this->database);        
        $replace=[
            "persona_nombre"=>$faker->firstName(),
            "persona_apellido"=>$faker->lastName
        ];
        //$people->update($data["dni"],$replace);
        $now=$this->searchUser('123');
        var_dump($now);
        /*$this->assertEquals($now["persona_nombre"],$insert["persona_nombre"]);
        $this->assertEquals($now["persona_apellido"],$insert["persona_apellido"]);*/
    }    
}
