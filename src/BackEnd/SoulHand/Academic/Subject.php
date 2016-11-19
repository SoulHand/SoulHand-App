<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

class Subject{
	protected $database;
	public function __construct($PDO){
		$this->database=$PDO;
	}
	public function create($input){		
		$stm=$this->database->prepare("INSERT INTO materia(materia_nombre) VALUES(:subject_name)");
		$query=$stm->execute($input);
		if(!$query){
			throw new \PDOException("No se pudo insertar el registro o ya existe!");			
		}
		return $this->database->lastInsertId();
	}
	public function find($id){
		$stm=$this->database->prepare("SELECT * FROM materia WHERE materia_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la materia!");			
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function update($id,$data){
		$fields =[];
		$SQL="UPDATE materia SET";
    	foreach ($data as $key => $value) {
    		$fields[]=" {$key}=:{$key}";
    	}
    	$SQL.=implode(',',$fields);
    	$SQL.=" WHERE materia_cod=:materia_cod";
    	$data["materia_cod"]=$id;
		$stm=$this->database->prepare($SQL);
		$query=$stm->execute($data);
	}
	public function delete($id){
		$stm=$this->database->prepare("DELETE FROM materia WHERE materia_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("La materia no existe o no pudo ser eliminada");			
		}
	}
}