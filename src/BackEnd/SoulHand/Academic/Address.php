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
			throw new PDOException("No existe la parroquia!");			
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
}