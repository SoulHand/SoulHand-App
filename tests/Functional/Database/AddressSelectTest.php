<?php

namespace Tests\Functional\Database;
use \SoulHand\Validator;
use \SoulHand\ValidatorException;
use \Faker\Factory;
use \SoulHand\Academic\Address;

class AddressSelectTest extends DatabaseTestCase
{
    public function testSelectProvince()
    {
        $address=new Address($this->database);
        $all=$address->getProvince('VE');
        $this->assertTrue(count($all)>0);
    } 
    public function testSelectMunicipality()
    {
        $address=new Address($this->database);
        $all=$address->getMunicipality(13);
        $this->assertTrue(count($all)>0);
    }
    public function testSelectParish()
    {
        $address=new Address($this->database);
        $all=$address->getParish(1);
        $this->assertTrue(count($all)>0);
    }    
}