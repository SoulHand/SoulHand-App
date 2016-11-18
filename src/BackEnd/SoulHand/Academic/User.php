<?php
 namespace SoulHand\Academic;

 class User{
 	protected $database;
 	protected $HASH="bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3";
 	public function __construct($pdo){
 		$this->database=$pdo; 		
 	}
 	 public function Encrypt ($input) {
        $output = base64_encode(
        	mcrypt_encrypt(
        		MCRYPT_RIJNDAEL_256,
        		md5($this->HASH),
        		$input,
        		MCRYPT_MODE_CBC,
        		md5(md5($this->HASH))
        	)
        );
        return $output;
    }
 
    public function Decrypt($input) {
        $output = rtrim(
        	mcrypt_decrypt(
        		MCRYPT_RIJNDAEL_256,
        		md5($this->HASH),
        		base64_decode($input),
        		MCRYPT_MODE_CBC,
        		md5(md5($this->HASH))
        	), 
        	"\0"
        );
        return $output;
    }
 }