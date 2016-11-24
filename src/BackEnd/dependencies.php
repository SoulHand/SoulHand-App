<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};
$container['database'] = function ($c) {
    $settings = $c->get('settings')['database'];
    return new \PDO($settings["connection"],$settings["user"],$settings["password"]);
};
// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};
$container['errorHandler'] = function ($c) {
  /**
    * @param Slim\Request $request
    * @param Slim\Response $response
    * @param Exception $exception
    */
  return function ($request, $response, $exception) use ($c) {
    $httpStatus = 500;
    /** @var \ArrayObject $body */
    $body = [];    
    if ($exception instanceof \SouldHand\Exception) {
      $httpStatus = $exception->httpStatus;
      $body = $exception->getJSON();
    }else{
      $body = [
        'message' => $exception->getMessage(),
        'code' => $exception->getCode()
      ];      
    }   
    return $response->withJSON($body,$httpStatus);
  };
};
