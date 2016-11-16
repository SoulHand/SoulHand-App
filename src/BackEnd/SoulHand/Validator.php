<?php
namespace SoulHand;
use \Respect\Validation\Validator as v;
use \Respect\Validation\Exceptions\NestedValidationException;
use \SoulHand\ValidatorException;

class Validator{
	/**
	* @var \Respect\Validation\Validator as rules
	 */
	protected $rules;
	/**
	* @return void; 
	*/
	public function __construct(){
		$this->rules= new v();
	}
	/**
	* @return void;
	*/	
	private function rulesUser(){
		$this->rules->key('name', v::stringType())
		->key('birthdate', v::date('d-m-Y'))
		->key('phone',v::phone())
		->key('email',v::email());		
	}
	/**
	* @return void;
	*/
	private function rulesUserAuth(){
		$this->rules->key('username',v::regex('/^[a-z\d_\\.]{4,20}$/i'))
		->key('password',v::stringType()->length(6,20));
	}
	/**
	* @return void;
	*/
	private function rulesUserDoc(){
		$this->rules->key('dni',v::regex('/^[VE][0-9]{5,9}$/'));
	}
	/**
	* @return void;
	*/
	private function rulesActivitiesBasic(){
		$this->rules->key('activity_subject',v::stringType()->length(4,45))
		->key('activity_name',v::stringType()->length(4,45))
		->key('activity_description',v::stringType())
		->key('activity_expiration_date',v::date()->min('now + 1 days'));
	}
	/**
	* @return void;
	*/
	private function rulesInstitute(){
		$this->rules->key('institute_name',v::stringType()->length(4,45))
		->key('institute_address',v::stringType())
		->key('activity_name',v::stringType()->length(4,45))
		->key('parroquia_name',v::stringType()->length(4,45));
	}
	/**
	* @return void;
	*/
	private function rulesSubject(){
		$this->rules->key('subject_name',v::stringType()->length(4,45));
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function UserAll($data){
		try{
			$this->rulesUser();
			$this->rulesUserAuth();
			$this->rulesUserDoc();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function UserAuth($data){
		try{
			$this->rulesUserAuth();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function UserPeople($data){
		try{
			$this->rulesUser();
			$this->rulesUserDoc();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function UserDoc($data){
		try{
			$this->rulesUserDoc();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function User($data){
		try{
			$this->rulesUser();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function Activity($data){
		try{
			$this->rulesActivitiesBasic();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean; 
	*/
	public function Institute($data){
		try{
			$this->rulesInstitute();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
	/**
	* @param \ArrayObject as $data
	* @return boolean;
	*/
	public function Subject($data){
		try{
			$this->rulesSubject();
			return $this->rules->assert($data);
		}catch(NestedValidationException $e){
			throw new ValidatorException('Campos Invalidos', $e);
		}
	}
}