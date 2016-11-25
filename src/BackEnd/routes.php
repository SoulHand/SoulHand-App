<?php
use \SoulHand\Academic\Address;
use \SoulHand\Academic\Institute;
use \SoulHand\Validator;
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
$app->group('/v1',function() use($app){
	/**
	* Address Routes
	* /Province/
	* /Municipality/
	* /Parish/
	*/
	$app->group('/Address',function()use($app){
		$app->get('/Province[/{country}]',function($request,$response,$args){
			$country='VE';
			if(isset($args["country"])){
				$country=strtoupper($args["country"]);
			}
			$address=new Address($this->database);
			$province=$address->getProvince($country);
			return $response->withJson($province,200);
		});
		$app->get('/Municipality[/{province}]',function($request,$response,$args){
			$country='SUC';
			if(isset($args["province"])){
				$country=strtoupper($args["province"]);
			}
			$address=new Address($this->database);
			$province=$address->getMunicipality($country);
			return $response->withJson($province,200);
		});
		$app->get('/Parish[/{municipality}]',function($request,$response,$args){
			$country='13';
			if(isset($args["municipality"])){
				$country=strtoupper($args["municipality"]);
			}
			$address=new Address($this->database);
			$province=$address->getParish($country);
			return $response->withJson($province,200);
		});
	});
	$app->group('/Academic',function()use($app){
		/**
		* Institute Routes
		* POST / create
		* GET /[{cod}] get all or get one
		* DELETE /{cod} delete
		*/
		$app->group('/Institute',function()use($app){
			$app->post('/',function($request,$response,$args){
				$post = $request->getParsedBody();
				$Validator=new Validator('Institute');
				$Validator->validate($post);
				$address=new Address($this->database);
				$province=$address->findParish($post["parish_cod"]);
				$address=new Institute($this->database);
				$province=$address->create($post);
				return $response->withJson([
					"code"=>"001",
					"message"=>"registro almacenado satisfactoriamente"
				],200);
			});
			$app->get('/[{cod}]',function($request,$response,$args){
				$address=new Institute($this->database);
				if(isset($args["cod"])){
					$Validator=new Validator('Institute');
					$Validator->rulescodInstitute($args["cod"]);
					$institute=$address->find($args["cod"]);
					return $response->withJson($address->rowPrepare($institute),200);
				}else{
					$institutes=$address->getAll();
					return $response->withJson($address->prepare($institutes),200);
				}				
			});
			$app->delete('/{id}',function($request,$response,$args){
				$institute=new Institute($this->database);
				$Validator=new Validator('Institute');
				$Validator->rulescodInstitute($args["id"]);
				$institute->delete($args["id"]);
				return $response->withJson([
					"code"=>"001",
					"message"=>"Registro eliminado satisfactoriamente"
				],200);
			});
			$app->post('/{id}',function($request,$response,$args){
				$input=$request->getParsedBody();
				$fields=[
					"institute_name"=>"institucion_nombre",
					"institute_address"=>"institucion_direccion",
					"parish_cod"=>"parroquia_parroquia_id",
				];
				$filters=[];
				foreach ($input as $key => $value) {
					if(array_key_exists($key, $input)){
						$filters[$fields[$key]]=$value;
					}
				}
				if(isset($filters["parroquia_parroquia_id"])){
					$address=new Address($this->database);
					$province=$address->findParish($filters["parroquia_parroquia_id"]);
				}
				$institute=new Institute($this->database);
				$Validator=new Validator('Institute');
				$Validator->rulescodInstitute($args["id"]);
				$institute->update($args["id"],$filters);
				return $response->withJson([
					"code"=>"001",
					"message"=>"Registro actualizado satisfactoriamente"
				],200);
			});
		});
		/*$app->group('/Subject',function()use($app){
			$app->post('/',function($request,$response,$args){

			});
		});*/
	});
});