<?php

namespace Tests\Functional;
use \SoulHand\UPTOSCR\SOAP;
use \Faker\Factory;
use \Mockery;

class SoapTest extends BaseTestCase
{    
    public function testRequestSoapGood()
    {        
        $faker = Factory::create("es_ES");
        $nacionality=$faker->regexify('[VE]');
        $dni=$faker->regexify('^[0-9]{5,9}$');
        $responseSOAP=[
            [
                [
                    "data"=>[
                        //row's people
                        [
                            "profile_id"=>$faker->regexify('^[0-9]{5}$'),
                            "profile_id_str"=>'00'.$faker->regexify('^[0-9]{5}$'),
                            "customcode"=>$faker->regexify('^[0-9]{13}$'),
                            "nationality"=>$nacionality,
                            "nationality_str"=> ($nacionality=="V") ? "Venezolano" : "Extrangero",
                            "pin"=> $dni,
                            "pin_str"=> $nacionality.'-'.$dni,
                            "fullname"=> $faker->name,
                            "shortname"=> $faker->firstName.' '.$faker->lastName,
                            "firstnames"=> $faker->firstName,
                            "lastnames"=> $faker->lastName,
                            "sex"=> $faker->regexify('[MF]'),
                            "sex_str"=> $faker->regexify('(Masculino|Femenino)'),
                            "type"=> $faker->numberBetween(1,2),
                            "type_str"=>[
                                $faker->regexify('(Estudiante|Profesor)')
                            ],
                            "profile_image_url"=> $faker->url,
                            "status"=> 1,
                            "status_str"=> "Activo",
                            "create"=> $faker->date('Y-m-d H:i:s.u','now'),
                            "last_update_str"=> $faker->date('D d M Y, h:iA','now'),
                            "home"=> "1",
                            "additional"=> $faker->title,
                            "ldap_account"=> "iel"
                        ]
                    ]
                ]
            ]
        ];
        $phpunitMock = $this->createMock('\SoulHand\UPTOSCR\SOAP');
        $phpunitMock->expects($this->any())
             ->method('getPeople')
             ->will($this->returnValue($responseSOAP));
        $response=$phpunitMock->getPeople($nacionality.$dni);
        $this->assertNotEmpty($response);
    }
}