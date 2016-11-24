<?php

namespace Tests\Functional;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \Faker\Provider\en_US\PhoneNumber;

class ValidatorTest extends BaseTestCase
{
    /**
    * Validar datos de usuarios reales
    * @var $validator \SoulHand\Validator clase para validaciones de campos
    * @return boolean
    */
    public function testValidatorUserAllTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $Validator=new Validator('userAll');
        $data=[
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email,
            "username"=>$faker->userName,
            "password"=>$faker->password,
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserAuthTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $Validator=new Validator('UserAuth');
        $data=[            
            "username"=>$faker->userName,
            "password"=>$faker->password
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserPeopleTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $Validator=new Validator('User');
        $data=[
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email,            
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $Validator=new Validator('User');
        $data=[
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "email"=>$faker->email
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserDocTrue()
    {
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $Validator=new Validator('UserDoc');
        $data=[
            "dni"=>$faker->regexify('^[VE][0-9]{5,9}$')
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorUserDocFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator('UserDoc');
        $data=[            
            "dni"=>$faker->regexify('^[VE][0-9]{3}$')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorUserPeopleFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator('User');
        $data=[
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorUserAuthFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator('UserAuth');
        $data=[
            "username"=>$faker->password,
            "password"=>$faker->userName
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorUserFalse()
    {
        $faker = Factory::create("es_ES");
        $Validator=new Validator('User');
        $data=[
            "first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}')            
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    } 
    public function testValidatorUserAllFalse()
    {
    	$faker = Factory::create("es_ES");
    	$Validator=new Validator('UserAll');
    	$data=[
    		"first_name"=>$faker->firstName,
            "last_name"=>$faker->lastName,
            "birthdate"=>$faker->dateTimeThisCentury->format('d-m-Y'),
            "phone"=>$faker->email,
            "email"=>$faker->regexify('^\+58[2-4][0-9]{9}'),
            "username"=>$faker->password,
            "password"=>$faker->userName,
            "dni"=>$faker->regexify('^[VE][0-9]{3}$')
    	];
    	$this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorActivityTrue(){
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $objDate=$faker->dateTimeInInterval('1 days','+ 2 days', date_default_timezone_get());
        $Validator=new Validator('ActivitiesBasic');
        $data=[
            "activity_subject"=>$faker->text(45),
            "activity_name"=>$faker->text(45),
            "activity_description"=>$faker->realText(),
            "activity_expiration_date"=>$objDate->format('d-m-Y H:i:s')
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorActivityAlternativeDateValide(){
        $faker = Factory::create("es_ES");
        $faker->addProvider(new PhoneNumber($faker));
        $objDate=$faker->dateTimeInInterval('1 days','+ 1 days', date_default_timezone_get());
        $Validator=new Validator('ActivitiesBasic');
        $data=[
            "activity_subject"=>$faker->text(45),
            "activity_name"=>$faker->text(45),
            "activity_description"=>$faker->realText(),
            "activity_expiration_date"=>$objDate->format('d-m-Y H:i:s')
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorActivityFalse(){
        $faker = Factory::create("es_ES");
        $objDate=$faker->dateTimeInInterval('1 days','+ 2 days', date_default_timezone_get());
        $Validator=new Validator('ActivitiesBasic');
        $data=[
            "activity_subject"=>$faker->text(50),
            "activity_name"=>$faker->text(50),
            "activity_description"=>$faker->realText(),
            "activity_expiration_date"=>$objDate->format('m-Y-Y i:H:s')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);        
    }
    public function testValidatorActivityExpirationNow(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('ActivitiesBasic');
        $data=[
            "activity_subject"=>$faker->text(50),
            "activity_name"=>$faker->text(50),
            "activity_description"=>$faker->realText(),
            "activity_expiration_date"=>date('Y-m-d H:i:s')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);        
    }
    public function testValidatorActivityDateExpirateFalse(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('ActivitiesBasic');
        $data=[
            "activity_subject"=>$faker->text(50),
            "activity_name"=>$faker->text(50),
            "activity_description"=>$faker->realText(),
            "activity_expiration_date"=>$faker->date('d-m-Y H:i:s','now')
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorInstituteTrue(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('Institute');
        $data=[
            "institute_name"=>$faker->text(45),
            "institute_address"=>$faker->address,
            "parish_cod"=>$faker->text(45)
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorInstituteFalse(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('Institute');
        $data=[
            "institute_name"=>$faker->paragraphs(100),
            "institute_address"=>$faker->address,
            "parish_cod"=>$faker->paragraphs(100)
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
    public function testValidatorSubjectTrue(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('Subject');
        $data=[
            "subject_name"=>$faker->text(45)
        ];
        $val=$Validator->validate($data);
        $this->assertTrue($val);
    }
    public function testValidatorSubjectFalse(){
        $faker = Factory::create("es_ES");
        $Validator=new Validator('Subject');
        $data=[
            "subject_name"=>$faker->realText(100)
        ];
        $this->expectException(ValidatorException::class);
        $val=$Validator->validate($data);
    }
}