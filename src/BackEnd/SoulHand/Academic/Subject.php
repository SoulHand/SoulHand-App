<?php
namespace SoulHand\Academic;

class Subject{
	protected $database;
	public function __construct($PDO){
		$this->database=$PDO;
	}
	
}