<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

class Institute{
	protected $database;
	public function __construct($PDO){
		$this->database=$PDO;
	}
	public function create($input){		
		$stm=$this->database->prepare("INSERT INTO institucion(institucion_nombre,institucion_direccion,parroquia_parroquia_id) VALUES(UPPER(trim(:institute_name)),trim(UPPER(:institute_address)),:parish_cod)");
		$query=$stm->execute($input);
		if(!$query){
			throw new \PDOException("No se pudo insertar el registro o ya existe!");
		}
		return $this->database->lastInsertId();
	}
	public function find($id){
		$stm=$this->database->prepare("SELECT * FROM institucion WHERE institucion_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la materia!");			
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function getAll(){
		$stm=$this->database->query("SELECT * FROM institucion INNER JOIN parroquia on parroquia.parroquia_id=parroquia_parroquia_id ORDER BY institucion_nombre ASC");
		if($stm->rowCount()==0){
			throw new PDOException("No existe la institucion!");			
		}
		return $stm->fetchAll(PDO::FETCH_ASSOC);
	}
	public function prepare($query){
		$data=[];
		foreach ($query as $value) {
			$data[]=$this->rowPrepare($value);
		}
		return $data;
	}
	public function rowPrepare($value){
		$stm=$this->database->query("SELECT * FROM parroquia WHERE parroquia_id={$value['parroquia_parroquia_id']}");
		$parish=$stm->fetch(PDO::FETCH_ASSOC);
		return [
			"id"=>$value["institucion_cod"],
			"name"=>$value["institucion_nombre"],
			"address"=>$value["institucion_direccion"],
			"parish"=>[
				"id"=>$parish["parroquia_id"],
				"name"=>$parish["parroquia_nombre"]
			]
		];
	}
	public function update($id,$data){
		$fields =[];
		$SQL="UPDATE institucion SET";
    	foreach ($data as $key => $value) {
    		$fields[]=" {$key}=:{$key}";
    	}
    	$SQL.=implode(',',$fields);
    	$SQL.=" WHERE institucion_cod=:materia_cod";
    	$data["materia_cod"]=$id;
		$stm=$this->database->prepare($SQL);
		$query=$stm->execute($data);
	}
	public function delete($id){
		$stm=$this->database->prepare("DELETE FROM institucion WHERE institucion_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("La institucion no existe o no pudo ser eliminada");			
		}
	}
}