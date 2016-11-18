<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\User;

class createUserTest extends DatabaseTestCase
{
    public function testInsertUserPeople()
    {
    	$faker = Factory::create("es_ES");
    	$data=[
    		"dni"=>$faker->regexify('/[VE][0-9]{6,10}/'),
    		"first_name"=>$faker->firstName,
    		"last_name"=>$faker->lastName,
    		"birthdate"=>$faker->date('d-m-Y'),
    		"phone"=>$faker->phoneNumber,
    		"email"=>$faker->email,
    		"password"=>$faker->password,
    		"username"=>$faker->username
    	];
    	$people=new User($this->database);
    	$people->create($data);
		$search=$this->searchPeople($data["dni"]);
		$user=$this->searchUser($data["dni"]);
		$this->asserEquals($search["persona_cedula"],$data["dni"]);    	
		$this->asserEquals($search["persona_nombre"],$data["first_name"]);    	
		$this->asserEquals($search["persona_apellido"],$data["last_name"]);    	
		$this->asserEquals($search["persona_fecha_nacimiento"],$data["birthdate"]);    	
		$this->asserEquals($search["persona_telefono"],$data["phone"]);    	
		$this->asserEquals($search["persona_correo"],$data["email"]);
		$this->asserEquals($user["usuario_nombre"],$data["username"]);
		$this->assertNotNull($user["usuario_contrasena"]);
        /*$people=$this->insertPeople();
        $user=$this->insertUser($people["persona_cedula"]);*/
    }
    public function testInsertUserAlone(){
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
    	$user=new User($this->database);
    	$user->create($data);
		$search=$this->searchUser($data["dni"]);
    	$this->asserEquals($search["persona_cedula"],$data["dni"]);    	
		$this->asserEquals($search["usuario_nombre"],$data["first_name"]);    	
		$this->asserEquals($search["persona_apellido"],$data["last_name"]);    	
		$this->asserEquals($search["persona_fecha_nacimiento"],$data["birthdate"]);    	
		$this->asserEquals($search["persona_telefono"],$data["phone"]);    	
		$this->asserEquals($search["persona_correo"],$data["email"]);
		$this->asserEquals($user["usuario_nombre"],$data["username"]);
		$this->assertNotNull($user["usuario_contrasena"]);
    }
    public function testEncryptUser(){
    	$faker = Factory::create("es_ES");
    	$texto=$faker->text(100);
    	$user=new User($this->database);
    	$encrypt=$user->Encrypt($texto);
    	$decrypt=$user->Decrypt($encrypt);
    	$this->assertEquals($texto,$decrypt);
    }
}