<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\User;

class DeleteUserTest extends DatabaseTestCase
{    
    public function testDeleteUser(){
        $people=$this->insertPeople();      
        $user=new User($this->database);
        $user->delete($people["persona_cedula"]);
        $now=$this->searchUser($people["persona_cedula"]);
        $this->assertFalse($now);
    }
    public function testDeleteFakeUser(){
        $faker = Factory::create("es_ES");
        $dni=$faker->regexify('/[VE][0-9]{6,10}/');
        $user=new User($this->database);
        $this->expectException(\PDOException::class);
        $user->delete($dni);
    }
}
