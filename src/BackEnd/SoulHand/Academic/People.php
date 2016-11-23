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
		$datetime = \DateTime::createFromFormat('d-m-Y', $input["birthdate"]);
		$data=[
			"persona_cedula"=>$input["dni"],
			"persona_nombre"=>$input["first_name"],
			"persona_apellido"=>$input["last_name"],
			"persona_telefono"=>$input["phone"],
			"persona_fecha_nacimiento"=>$datetime->format('Y-m-d'),
			"persona_correo"=>$input["email"]
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
		$stm->bindValue(':persona_imagen', (isset($input["image"])) ? $input["image"] : NULL, PDO::PARAM_LOB);
		$stm->bindValue(':persona_cedula', $data["persona_cedula"], PDO::PARAM_STR);
		$stm->bindValue(':persona_nombre', $data["persona_nombre"], PDO::PARAM_STR);
		$stm->bindValue(':persona_apellido', $data["persona_apellido"], PDO::PARAM_STR);
		$stm->bindValue(':persona_telefono', $data["persona_telefono"], PDO::PARAM_STR);
		$stm->bindValue(':persona_fecha_nacimiento', $data["persona_fecha_nacimiento"], PDO::PARAM_STR);
		$stm->bindValue(':persona_correo', $data["persona_correo"], PDO::PARAM_STR);
		$query=$stm->execute();
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
	public function delete($dni){
		$stm=$this->database->prepare("DELETE FROM persona WHERE persona_cedula=?");
		$query=$stm->execute([$dni]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la Persona!");
		}
	}
	public function update($dni,$values){
		$fields=[];
		foreach ($values as $key => $value) {
			$fields[]="{$key}=:{$key}";
		}
		$fields=implode(',',$fields);
		$SQL="UPDATE persona SET {$fields} WHERE persona_cedula=:dni";		
		$stm=$this->database->prepare($SQL);
		$query=$stm->execute(array_merge($values,[
			"dni"=>$dni
		]));
		if($stm->rowCount()==0){
			throw new PDOException("No existe la Persona!");
		}
	}
	public function search($filters){
		$fields=[];
		foreach ($filters as $key => $value) {
			$fields[]="{$key}=:{$key}";
		}
		$fields=implode(' AND ',$fields);
		$SQL="SELECT * FROM persona WHERE {$fields}";
		$stm=$this->database->prepare($SQL);
		$query=$stm->execute($filters);
		if($stm->rowCount()==0){
			throw new PDOException("No existe personas con esta descripciones!");
		}
		return $stm->fetchAll(PDO::FETCH_ASSOC);
	}
	public function isExist($dni){
		$stm=$this->database->prepare("SELECT * FROM persona WHERE persona_cedula=?");
		$query=$stm->execute([$dni]);
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
}