<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;

class createUserTest extends DatabaseTestCase
{    
    public function testValidatorUserAllTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new \Faker\Provider\en_US\PhoneNumber($faker));
        $Validator=new Validator();
        $data=[
            "name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email,
            "username"=>$faker->userName,
            "password"=>$faker->password,
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->UserAll($data);
        $this->assertTrue($val);
    }
}