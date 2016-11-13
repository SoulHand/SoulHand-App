<?php

namespace Tests\Functional;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;

class ValidatorTest extends BaseTestCase
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
    public function testValidatorUserAuthTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new \Faker\Provider\en_US\PhoneNumber($faker));
        $Validator=new Validator();
        $data=[            
            "username"=>$faker->userName,
            "password"=>$faker->password
        ];
        $val=$Validator->UserAuth($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserPeopleTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new \Faker\Provider\en_US\PhoneNumber($faker));
        $Validator=new Validator();
        $data=[
            "name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email,            
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->UserPeople($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new \Faker\Provider\en_US\PhoneNumber($faker));
        $Validator=new Validator();
        $data=[
            "name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email
        ];
        $val=$Validator->User($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserDocTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new \Faker\Provider\en_US\PhoneNumber($faker));
        $Validator=new Validator();
        $data=[
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->UserDoc($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserDocFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator();
        $data=[            
            "dni"=>$faker->regexify('^[VE][0-9]{3}$')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->UserDoc($data);
    }
    public function testValidatorUserPeopleFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator();
        $data=[
            "name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->UserPeople($data);
    }
    public function testValidatorUserAuthFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator();
        $data=[
            "username"=>$faker->password,
            "password"=>$faker->userName
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->UserAuth($data);
    }
    public function testValidatorUserFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator();
        $data=[
            "name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}')            
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->UserAll($data);
    } 
    public function testValidatorUserAllFalse()
    {
    	$faker = Factory::create("es_ES");
    	$Validator=new Validator();
    	$data=[
    		"name"=>$faker->name,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "username"=>$faker->password,
            "password"=>$faker->userName,
            "dni"=>$faker->regexify('^[VE][0-9]{3}$')
    	];
    	$this->expectException(ValidatorException::class);
        $val=$Validator->UserAll($data);
    }    
}