<?php
 namespace SoulHand\Academic;

 class User extends People{
 	protected $HASH="bcb04b7e103a0cd8b54763051cef08bc55abe029fdebae5e1d417e2ffb2a00a3"; 	
    public function create($data,$role='ALUMNO'){
        $val=Parent::isExist($data["dni"]);
        if(!$val){
            $val=Parent::create($data);
        }
        $USER=[
            "persona_cedula"=>$val["persona_cedula"],
            "usuario_nombre"=>$data["username"],
            "usuario_contrasena"=>$data["password"],
            "usuario_role"=>$role
        ];
        $stm=$this->database->prepare("INSERT INTO usuario(
                persona_cedula,
                usuario_nombre,
                usuario_contrasena,
                usuario_role
            )
            VALUES(
                :persona_cedula,
                :usuario_nombre,
                :usuario_contrasena,
                :usuario_role
            )
        ");
        $query=$stm->execute($USER);
        if(!$query){
            throw new PDOException("El siguiente usuario ya existe!");            
        }
        return array_merge($val,$USER);
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