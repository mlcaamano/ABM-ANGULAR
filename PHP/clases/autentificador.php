<?php

include_once 'JWT.php';
include_once 'ExpiredException.php';
include_once 'BeforeValidException.php';
include_once 'SignatureInvalidException.php';


$objDatos=json_decode(file_get_contents("php://input"));
//$idUsuario=Usuario::ChequearUsuario($objDatos->usuario,$objDatos->clave);


//1-tomo datos del http
//2-verifico con un metodo de la clase usuario si son datos validos
//3-de ser validos creo el token y lo retorno
if ($objDatos->usuario=="pepito" && $objDatos->clave=="666") {

		$idUsuario=1;

}else{

		$idUsuario=false;

}



if ($idUsuario==false) {

		$token=array(
		   "id"=>"natalia",
		   "nombre"=>"natalia",
		   "perfil"=>"Administrador",
		   "exp"=>time()-9600
			);

		$token=Firebase\JWT\JWT::encode($token,'22jackkeylo99');
		//token ya terminado
		$array['tokentest2016']=$token;

		echo json_encode($array);

}else{

		$token=array(
		   "id"=>"666",
		   "nombre"=>"pepito",
		   "perfil"=>"Administrador",
		   "exp"=>time()+9600
			);

		$token=Firebase\JWT\JWT::encode($token,'22jackkeylo99');
		//token ya terminado
		$array['tokentest2016']=$token;

		echo json_encode($array);

}

?>
