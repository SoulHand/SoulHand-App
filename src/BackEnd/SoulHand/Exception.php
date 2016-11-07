<?php
namespace SoulHand;

class Exception extends \Exception {
  /** @var number $httpStatus HTTP Status Code to be sent for the router */
  public $httpStatus = 401;
  /** @var string $errorCode Internal error code */
  public $errorCode = '0000';
  public $error;
  public function __construct($message,$error=NULL){
    parent::__construct($message);
    $this->error=$error;
  }
  /**
   * Converts the exception to a JSON-friendly structure
   */
  public function getJSON() {
    return [
      'error_code' => $this->errorCode,
      'message' => $this->error->getMessage()
    ];
  }
  /**
   * Takes the JSON structure and adds more details to be used for logging
   */
  public function getDetails() {
    $json = $this->getJSON();
    $json['name'] = __CLASS__;
    return $json;
  }
}
