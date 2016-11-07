<?php
namespace SoulHand\UPTOSCR;

abstract class SOAP{
	public function getPeople($dni){
		require_once(__DIR__.'/nusoap/nusoap.php');
		require_once(__DIR__.'/utils.php');
    //token de seguridad
		$clientToken = 'b2fa185110314ab3ac3c080fa2aecb83';
	//dominio del directorio de personal y estudiantes
		$wsdl = 'http://api.uptos.edu.ve/1.7.7/directory/xml.php?wsdl';       
	// crea cliente soap para buscar persona
		$client = new \nusoap_client($wsdl, true,false,false,false,false,3,3);
		$ldap = $client->getProxy();
		$data=null;
		if($client->getError()){
			throw new ClientException("Fail client request", $client->getError());
		}
		$user=preg_replace("/^[E|V](.-)?/", '',$dni);		
		try{
			$data = $ldap->searchPersonOnDirectory($clientToken,$dni);
			if($client->fault) {
				throw new ClientException("Fail client request", $client->fault);
			} else {
				if($client->getError())
					throw new ClientException("Fail client request", $client->getError());
			}
			if(!isset($data[0])){
				throw new SOAPException("DATA PARSE FAIL");
			}
			$data=$data[0]["data"][0];
			return $data;
		}catch(exception $error){
			throw new SOAPException("Error Processing Request", $error);			
		}
	}
}