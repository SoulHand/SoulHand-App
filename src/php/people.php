<?php
abstract class People{
	protected $app;
	static function get_users($config,$filter=NULL){
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql='SELECT cedula,nombre_apellido as name,username, tel, correo,to_char(fecha_nacimiento, \'dd-mm-YYYY\') as date, admin,tipo as type FROM usuario '.(($filter!=NULL) ? 'WHERE cedula=:filter OR username=:filter OR email=:filter' : '').' ORDER BY nombre_apellido ASC';
			$query = $conn->prepare($sql);
			$args=($filter!=NULL) ? ["filter"=>$filter] : NULL;
			$query->execute($args);
			return $query->fetchAll(PDO::FETCH_OBJ);
		}catch(PDOException $e){
			return [];
		}
	}
	static function isValide($input,$value){
		$fields=Array(
			"id"=>Array(
				"name"=>"cedula",
				"pattern"=>"/^[V|E|J][0-9]{6,9}$/i",
				"required"=>true
				),
			"name"=>Array(
				"name"=>"nombre_apellido",
				"pattern"=>"/\w+/i",
				"required"=>true
				),
			"username"=>Array(
				"name"=>"username",
				"pattern"=>"/^[a-z\d_]{4,15}$/i ",
				"required"=>true
				),
			"password"=>Array(
				"name"=>"contrasena",
				"pattern"=>"/.{6,18}/i",
				"required"=>true
				),
			"phone"=>Array(
				"name"=>"tel",
				"pattern"=>"/^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/i",
				"required"=>false
				),
			"email"=>Array(
				"name"=>"correo",
				"pattern"=>"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i",
				"required"=>true
				),
			"date"=>Array(
				"name"=>"fecha_nacimiento",
				"pattern"=>"/(([0-9]{2}\-[0-9]{2}\-[0-9]{4})|([0-9]{4}\-[0-9]{2}\-[0-9]{2}))/i",
				"required"=>false
				),
			"type"=>Array(
				"name"=>"tipo",
				"pattern"=>"/^((profesor)|(alumno))$/i",
				"required"=>true
				)
			);
		if(!isset($fields[$input])){
			return false;
		}
		if($fields[$input]["pattern"]==true && empty(trim($value))){
			return false;
		}
		if(isset($fields[$input]["pattern"])){
			if(!preg_match($fields[$input]["pattern"], $value)){
				return false;
			}
		}
		return $fields[$input]["name"];
	}
	static function edit_perms($value,$id,$config){
		$sql="UPDATE usuario SET admin=? WHERE cedula=?";
		if(!is_numeric($value)){
			return false;
		}
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);				
			$query = $conn->prepare($sql);
			$query->execute([$value,$id]);
			if($query->rowCount()>0){
				return true;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
	static function edit_user($fields,$id,$config){
		$sql="UPDATE usuario SET ";
		foreach ($fields as $key => $value) {
			$field=People::isValide($key,$value);
			if(!$field){
				return false;
			}
			if($field=="contrasena"){
				$sql.="{$field}=md5(:{$key}),";
			}else{
				$sql.="{$field}=upper(:{$key}),";
			}
		}
		$sql[strlen($sql)-1]=' ';
		$sql.="WHERE cedula=:key";
		$fields["key"]=$id;
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);				
			$query = $conn->prepare($sql);
			$query->execute($fields);
			if($query->rowCount()>0){
				return true;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
	static function delete_user($config,$filter){
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql='DELETE  FROM usuario WHERE cedula=?';
			$query = $conn->prepare($sql);
			$query->execute([$filter]);
			if($query->rowCount()>0){
				return true;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
	static function add_user($fields,$config){
		$sql="INSERT INTO usuario(";
		$values="";
		foreach ($fields as $key => $value) {
			$field=People::isValide($key,$value);
			if(!$field){
				return false;
			}
			$sql.="{$field},";
			if($field=="contrasena"){
				$values.="md5(:{$key}),";
			}else{
				$values.="upper(:{$key}),";
			}
		}
		$sql[strlen($sql)-1]=')';
		$values[strlen($values)-1]=')';
		$sql.=" VALUES(".$values;
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);				
			$query = $conn->prepare($sql);
			$query->execute($fields);
			if($query->rowCount()>0){
				return true;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
	static function get_soap_people($dni){
		require_once('lib/nusoap/nusoap.php');
		require_once('lib/utils.php');    
    //token de seguridad
		$clientToken = 'b2fa185110314ab3ac3c080fa2aecb83';
	//dominio del directorio de personal y estudiantes
		$wsdl = 'http://api.uptos.edu.ve/1.7.7/directory/xml.php?wsdl';       
	// crea cliente soap para buscar persona
		$client = new nusoap_client($wsdl, true);
		$ldap = $client->getProxy();
		$data=null;
		if($client->getError()){
			return null;
		}
		$user=preg_replace("/^[E|V](.-)?/", '',$dni);
		var_dump($user);
		try{
			$data = $ldap->searchPersonOnDirectory($clientToken,$dni);
			if($client->fault) {
				die('Error grave');
			} else {
				if($client->getError())
					die($client->getError());
			}
			if(isset($data[0])){
				if(isset($data[0]["data"])){
					if(isset($data[0]["data"][0])){
						$data=$data[0]["data"][0];
					}
				}
			}
			return $data;			
		}catch(exception $error){
			return null;
		}
	}
}