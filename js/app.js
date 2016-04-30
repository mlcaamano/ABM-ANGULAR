
var app = angular.module('ABMangularPHP', ['ui.router', 'angularFileUpload']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('menu', 
  {
    templateUrl:"templatemenu.html",
    url:'/menu',
    controller:'controlMenu'
  })
  .state('grilla', 
  {
    templateUrl:"templategrilla.html",
    url:'/grilla',
    controller:'controlGrilla'
  })
  .state('alta', 
  {
    templateUrl:"templateusuario.html",
    url:'/alta',
    controller:'controlAlta'
  })
  .state('modificar', 
  {
    templateUrl:"templateusuario.html",
    url:'/modificar/{:id}?:nombre:apellido:dni:foto',
    controller:'controlModificar'
  })

  $urlRouterProvider.otherwise('/menu');

});

app.controller('controlMenu', function($scope, $http) {
  $scope.DatoTest="**Menu**";
});


app.controller('controlAlta', function($scope, $http, FileUploader) {
  $scope.DatoTest="**alta**";

  $scope.uploader = new FileUploader({url: 'PHP/nexo.php'});
      $scope.uploader.queueLimit = 1; // indico cuantos archivos permito cargar
            

//inicio las variables
  $scope.persona={};
  $scope.persona.nombre= "natalia" ;
  $scope.persona.dni= "12312312" ;
  $scope.persona.apellido= "natalia" ;
  $scope.persona.foto="pordefecto.png";

  $scope.cargarFoto=function(nombreDeFoto){

    var direccion="fotos/"+nombreDeFoto;

    $http.get(direccion, {responseType: "blob"})
    .then(

      function(respuesta){
        var mimetype=respuesta.data.type;
        var archivo=new File([respuesta.data], direccion, {type: mimetype});
        var fotoObtenida= new FileUploader.FileItem($scope.uploader, {});
        fotoObtenida._file= archivo;
        fotoObtenida.file={};
        fotoObtenida.file=new File([respuesta.data], nombreDeFoto, {type:mimetype});
        $scope.uploader.queue.push(fotoObtenida);
      }


      );

  }

  $scope.cargarFoto($scope.persona.foto);

  $scope.uploader.onSuccessItem= function(item, response, status, headers) {

  console.info("Voy a guardar", item, response,status, headers);

  $http.post('PHP/nexo.php', { datos: {accion :"insertar",persona:$scope.persona}})
  .then(function(respuesta) {       
    //aca se ejetuca si retorno sin errores        
    console.log(respuesta.data);

  },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });
  }

  $scope.Guardar=function(){

    if($scope.uploader.queue[0].file.name!='pordefecto.png')
    {
      var nombrefoto=$scope.uploader.queue[0].file.name;
      $scope.persona.foto=nombrefoto;
    }

    $scope.uploader.uploadAll();
  }
});


app.controller('controlGrilla', function($scope, $http) {
  	$scope.DatoTest="**grilla**";
 	
    function bien(respuesta)
    {
        $scope.ListadoPersonas = respuesta.data.listado;
        console.log(respuesta.data);
    }

    function mal(respuesta)
    {
        $scope.ListadoPersonas= [];
        console.log( response);
    }

  $http.get('PHP/nexo.php', { params: {accion :"traer"}})
  .then(bien, mal);

 	$scope.Borrar=function(persona){
		console.log("borrar"+persona);



$http.post("PHP/nexo.php",{datos:{accion :"borrar",persona:persona}},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
 .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
         console.log(respuesta.data);


        $http.get('PHP/nexo.php', { params: {accion :"traer"}})
  .then(function(respuesta) {       

         $scope.ListadoPersonas = respuesta.data.listado;
         console.log(respuesta.data);

    },function errorCallback(response) {
         $scope.ListadoPersonas= [];
        console.log( response);
   });


    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });

/*
     $http.post('PHP/nexo.php', 
      headers: 'Content-Type': 'application/x-www-form-urlencoded',
      params: {accion :"borrar",persona:persona})
    .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
         console.log(respuesta.data);

    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });

*/
 	}




 	$scope.Modificar=function(id){
 		
 		console.log("Modificar"+id);
 	}





});

app.controller('controlModificar', function($scope, $http, $stateParams, FileUploader) {
  $scope.DatoTest="**Modificar**";

  $scope.uploader = new FileUploader({url: 'PHP/nexo.php'});
  $scope.uploader.queueLimit = 1;

        $scope.persona={};
        $scope.persona.id=$stateParams.id ;
        $scope.persona.nombre= $stateParams.nombre ;
        $scope.persona.dni=$stateParams.dni ;
        $scope.persona.apellido= $stateParams.apellido ;
        $scope.persona.foto=$stateParams.foto;

  $scope.cargarFoto=function(nombreDeFoto){

    var direccion="fotos/"+nombreDeFoto;

    $http.get(direccion, {responseType: "blob"})
    .then(

      function(respuesta){
        var mimetype=respuesta.data.type;
        var archivo=new File([respuesta.data], direccion, {type: mimetype});
        var fotoObtenida= new FileUploader.FileItem($scope.uploader, {});
        fotoObtenida._file= archivo;
        fotoObtenida.file={};
        fotoObtenida.file=new File([respuesta.data], nombreDeFoto, {type:mimetype});
        $scope.uploader.queue.push(fotoObtenida);
      }


      );

  }

  $scope.cargarFoto($scope.persona.foto);

  $scope.uploader.onSuccessItem= function(item, response, status, headers) {

  console.info("Voy a modificar", item, response,status, headers);

    console.log($scope.persona);
    $http.post('PHP/nexo.php', { datos: {accion :"modificar",persona:$scope.persona}})
    .then(function(respuesta) {       
         //aca se ejetuca si retorno sin errores        
         console.log(respuesta.data);

    },function errorCallback(response) {        
        //aca se ejecuta cuando hay errores
        console.log( response);           
    });


  }

  $scope.Guardar=function(){

    if($scope.uploader.queue[0].file.name!='pordefecto.png')
    {
      var nombrefoto=$scope.uploader.queue[0].file.name;
      $scope.persona.foto=nombrefoto;
    }

    $scope.uploader.uploadAll();
  }
  
});
