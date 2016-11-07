<?php
abstract class Auth{
	static function login($username,$password,$config){
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql="SELECT cedula,nombre_apellido as name,username, tel, correo,to_char(fecha_nacimiento, 'dd-mm-YYYY') as date, admin,tipo as type FROM usuario WHERE username=? and contrasena=md5(?)";
			$query = $conn->prepare($sql);
			$query->execute([$username,$password]);
			if($query->rowCount()==1){
				$user=$query->fetch(PDO::FETCH_ASSOC);
				$user["token"]=Auth::get_token($user["cedula"],$config);
				return $user;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
	static function get_token($username,$config){
		$device=$_SERVER["HTTP_USER_AGENT"];
		$ip=Auth::getRealIP();
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql="SELECT token FROM sesiones WHERE cedula_usuario=? and dispositivo=? and ip=?";
			$query = $conn->prepare($sql);
			$query->execute([$username,$device,$ip]);
			if($query->rowCount()==1){
				return $query->fetch(PDO::FETCH_ASSOC)["token"];
			}else{				
				$sal='asdadsfsv0z5xc008a';
				$token=sha1($sal."-".$username."-".$device."-".$ip);
				$sql="INSERT INTO sesiones(token,dispositivo,cedula_usuario,ip) values(?,?,?,?)";
				$query = $conn->prepare($sql);
				$query->execute([$token,$device,$username,$ip]);
				if($query->rowCount()>0){
					return $token;
				}else{
					return false;
				}
			}
		}catch(PDOException $e){
			var_dump($e);
			return NULL;
		}
	}
	static function getRealIP()
{
 
   if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
   {
      $client_ip = 
         ( !empty($_SERVER['REMOTE_ADDR']) ) ? 
            $_SERVER['REMOTE_ADDR'] 
            : 
            ( ( !empty($_ENV['REMOTE_ADDR']) ) ? 
               $_ENV['REMOTE_ADDR'] 
               : 
               "unknown" );
 
      // los proxys van añadiendo al final de esta cabecera
      // las direcciones ip que van "ocultando". Para localizar la ip real
      // del usuario se comienza a mirar por el principio hasta encontrar 
      // una dirección ip que no sea del rango privado. En caso de no 
      // encontrarse ninguna se toma como valor el REMOTE_ADDR
 
      $entries = preg_split('/[, ]/', $_SERVER['HTTP_X_FORWARDED_FOR']);
 
      reset($entries);
      while (list(, $entry) = each($entries)) 
      {
         $entry = trim($entry);
         if ( preg_match("/^([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/", $entry, $ip_list) )
         {
            // http://www.faqs.org/rfcs/rfc1918.html
            $private_ip = array(
                  '/^0\./', 
                  '/^127\.0\.0\.1/', 
                  '/^192\.168\..*/', 
                  '/^172\.((1[6-9])|(2[0-9])|(3[0-1]))\..*/', 
                  '/^10\..*/');
 
            $found_ip = preg_replace($private_ip, $client_ip, $ip_list[1]);
 
            if ($client_ip != $found_ip)
            {
               $client_ip = $found_ip;
               break;
            }
         }
      }
   }
   else
   {
      $client_ip = 
         ( !empty($_SERVER['REMOTE_ADDR']) ) ? 
            $_SERVER['REMOTE_ADDR'] 
            : 
            ( ( !empty($_ENV['REMOTE_ADDR']) ) ? 
               $_ENV['REMOTE_ADDR'] 
               : 
               "unknown" );
   } 
   return $client_ip; 
}
	static function isValid($token,$config){
		$ip=Auth::getRealIP();
		$device=$_SERVER["HTTP_USER_AGENT"];
		try{
			$conn = new PDO($config["connection"], $config["user"], $config["password"]);
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$sql="SELECT cedula_usuario FROM sesiones WHERE token=? and ip=? and dispositivo=?";
			$query = $conn->prepare($sql);
			$query->execute([$token,$ip,$device]);
			if($query->rowCount()==1){
				return true;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return false;
		}
	}
}