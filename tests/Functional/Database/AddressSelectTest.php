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
        $all=$address->getProvince();
        $this->assertTrue(count($all)>0);
    }    
}