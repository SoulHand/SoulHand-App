<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

class People{
	protected $database;
	public function __construct($pdo){
		$this->database=$pdo;
	}
	public function create($input){
		$data=[
			"persona_cedula"=>$input["dni"],
			"persona_nombre"=>$input["first_name"],
			"persona_apellido"=>$input["last_name"],
			"persona_telefono"=>$input["phone"],
			"persona_fecha_nacimiento"=>$input["birthdate"],
			"persona_correo"=>$input["email"],
			"persona_imagen"=>pg_escape_bytea($input["image"])
		];		
		$stm=$this->database->prepare("INSERT INTO persona (
			persona_cedula,
			persona_nombre,
			persona_apellido,
			persona_telefono,
			persona_fecha_nacimiento,
			persona_correo,
			persona_imagen
		)
		VALUES(
			:persona_cedula,
			:persona_nombre,
			:persona_apellido,
			:persona_telefono,
			:persona_fecha_nacimiento,
			:persona_correo,
			:persona_imagen
		)
		");		
		$query=$stm->execute($data);
		if(!$query){
			throw new PDOException("Ya existe la persona!");			
		}
		return $data;
	}
	public function find($dni){
		$stm=$this->database->prepare("SELECT * FROM persona WHERE persona_cedula=?");
		$query=$stm->execute([$dni]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la Persona!");			
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function isExist($dni){
		$stm=$this->database->prepare("SELECT * FROM persona WHERE persona_cedula=?");
		$query=$stm->execute([$dni]);
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
}