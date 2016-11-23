<?php
namespace SoulHand\Academic;
use \PDOException;
use \PDO;

class Address{
	protected $database;
	public function __construct($PDO){
		$this->database=$PDO;
	}	
	public function findParish($id){
		$stm=$this->database->prepare("SELECT * FROM parroquia WHERE parroquia_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la parroquia!");			
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function findProvince($id){
		$stm=$this->database->prepare("SELECT * FROM provincia WHERE provincia_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe la provincia!");			
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function findMunicipality($id){
		$stm=$this->database->prepare("SELECT * FROM municipio WHERE municipio_cod=?");
		$query=$stm->execute([$id]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe el municipio!");
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function getParish($municipality){
		$stm=$this->database->query("SELECT * FROM parroquia  WHERE parroquia_id_municipio=? ORDER BY parroquia_nombre ASC");
		if($stm->rowCount()==0){
			throw new PDOException("No existe parroquias!");			
		}
		return $stm->fetchAll(PDO::FETCH_ASSOC);
	}
	public function getMunicipality($province){
		$stm=$this->database->prepare("SELECT * FROM municipio WHERE municipio_id_provincia=? ORDER BY municipio_nombre ASC");
		$query=$stm->execute([$province]);	
		if($stm->rowCount()==0){
			throw new PDOException("No existe municipios!");
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
	public function getProvince($country){
		$stm=$this->database->prepare("SELECT * FROM provincia WHERE provincia_id_pais=?  ORDER BY provincia_nombre ASC");
		$query=$stm->execute([$country]);
		if($stm->rowCount()==0){
			throw new PDOException("No existe provincias!");
		}
		return $stm->fetch(PDO::FETCH_ASSOC);
	}
}