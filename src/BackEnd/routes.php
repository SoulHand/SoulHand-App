<?php
// Routes
$app->get('/', function ($request, $response, $args) {
	$base_url = $request->getUri()->getBasePath();
	if (strpos($base_url, 'index.php') !== FALSE) {
    	$base_url = dirname($base_url); 
   	}
   	$args['_BASE'] = $base_url;
    return $this->renderer->render($response, 'index.phtml', $args);
});
$app->get('/info', function ($request, $response, $args) {   
    echo phpinfo();
});
//Api REST USER
$app->group('/user',function(){
	$this->get("/get[/{id}]",function($request,$response,$args){
		include_once('people.php');
		$users=People::get_users($this["settings"]["database"],$args["id"]);
		return $response->withJson($users,200);
	});
	$this->get("/delete/{id}",function($request,$response,$args){
		include_once('people.php');
		if(People::delete_user($this["settings"]["database"],$args["id"])){
			$users=Array(
				"message"=>"El usuario ha sido eliminado satisfactoriamente",
				"status"=>200
			);
		}else{
			$users=Array(
				"message"=>"No se pudo eliminar los datos del usuario",
				"status"=>406
			);			
		}
		return $response->withJson($users,$users["status"]);
	});
	$this->post("/edit/{id}",function($request,$response,$args){
		include_once('people.php');
		$post=$this->request->getParsedBody();
		if(People::edit_user($post,$args["id"],$this["settings"]["database"])){
			$data=[
				"message"=>"Datos actualizados satisfactoriamente",
				"status"=>200
			];
		}else{
			$data=[
				"message"=>"Hubo un error durante la actualización de datos",
				"status"=>406
			];
		}
		return $response->withJson($data,$data["status"]);
	});	
	$this->post("/add[/]",function($request,$response,$args){
		include_once('people.php');
		$post=$this->request->getParsedBody();
		if(People::add_user($post,$this["settings"]["database"])){
			$data=[
				"message"=>"Datos añadidos satisfactoriamente",
				"status"=>200
			];
		}else{
			$data=[
				"message"=>"Hubo un error durante la inserción de datos",
				"status"=>406
			];
		}
		return $response->withJson($data,$data["status"]);
	});
});
$app->group("/admin",function(){
	$this->post("/set/{id}",function($request,$response,$args){
		include_once('people.php');
		$post=$this->request->getParsedBody();
		if(!isset($post["value"])){
			return $response->withJson([
				"message"=>"Hubo un error durante la asignación de permisos",
				"status"=>406
			],406);
		}
		if(People::edit_perms($post["value"],$args["id"],$this["settings"]["database"])){
			$data=[
				"message"=>"permisos actualizados satisfactoriamente",
				"status"=>200
			];
		}else{
			$data=[
				"message"=>"Hubo un error durante la asignación de permisos",
				"status"=>406
			];
		}
		return $response->withJson($data,$data["status"]);
	});
});
$app->post("/auth[/]",function($request,$response,$args){
	include_once('auth.php');
	$post=$this->request->getParsedBody();
	if(!isset($post["username"]) || !isset($post["password"])){
		return $response->withJson([
			"message"=>"Error en los parametros de autenticación",
			"status"=>406
			],406);
	}
	$user=Auth::login($post["username"],$post["password"],$this["settings"]["database"]);
	if($user){
			return $response->withJson($user,200);
		}else{
			return $response->withJson([
			"message"=>"Error en autenticación: Usuario no existe o los datos de acceso son erroneos",
			"status"=>406
			],406);
		}
});
$app->get("/token/{token}",function($request,$response,$args){
	include_once('people.php');
	$valor=People::get_soap_people($args["token"]);
	var_dump($valor);
	/*include_once('auth.php');
	if(Auth::isValid($args["token"],$this["settings"]["database"])){
		echo "APROBADO";
	}else{
		echo "FUERA";
	}*/
});