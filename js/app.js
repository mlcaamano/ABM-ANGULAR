
var app = angular.module('ABMangularPHP', ['ui.router', 'angularFileUpload','satellizer']); 


//declaro la configuracion del app - RUTEO (ROUTE) - defino lo que quiero ver y llamo a los diferentes templates
app.config(function($stateProvider, $urlRouterProvider,$authProvider){


    $authProvider.loginUrl='Angular_PHP_ABM_Persona-ngrepeat/PHP/clases/autentificador.php';
    $authProvider.signupUrl='Angular_PHP_ABM_Persona-ngrepeat/PHP/clases/autentificador.php';
    $authProvider.tokenName='tokentest2016'
    $authProvider.tokenPrefix= 'ABM_Persona';
    $authProvider.authHeader= 'Data';

  $stateProvider
    .state('menu',
        {
          templateUrl: "templateMenu.html",
          url:'/menu',
          controller: 'controlMenu'
        })
    .state('alta',
        {
          templateUrl: "templateUsuario.html",
          url:'/alta',
          controller: 'controlAlta'
        })
    .state('grilla',
        {
          templateUrl: "templateGrilla.html",
          url:'/grilla',
          controller: 'controlGrilla'
        })
    .state('grillafiltro',
        {
          templateUrl: "templateGrillafiltro.html",
          url:'/grillafiltro',
          controller: 'controlGrillafiltro'
        })
    .state('modificar',
        {
          templateUrl: "templateUsuario.html",
          url:"/modificar/{:id}?:nombre:apellido:dni:foto",
          controller: 'controlModificar'
        })
    .state('login',
        {
          templateUrl: "templateLogin.html",
          url:"/login",
          controller: 'controlLogin'
        })


  $urlRouterProvider.otherwise('/menu');  

}); // fin config







// CONTROLLER LOGIN

app.controller('controlLogin', function($scope, $http, $auth, $state) {



}); // fin control login






// CONTROLLER MENÚ

app.controller('controlMenu', function($scope, $http, $auth, $state) {


}); // fin control menú








//CONTROL ALTA

app.controller('controlAlta', function($scope, $http, $state, FileUploader, $auth, serviceCargadorDeFotos) {



          $scope.DatoTest="**alta**";


//EMPIEZO A TRABAJAR CON FILEUPLOADER

      $scope.uploader = new FileUploader({url: 'php/nexo.php'});
      $scope.uploader.queueLimit = 1; 


        //inicio las variables
          $scope.persona={};
          $scope.persona.nombre= "natalia" ;
          $scope.persona.dni= "12312312" ;
          $scope.persona.apellido= "natalia" ;
          $scope.persona.foto="porDefecto.png";


          serviceCargadorDeFotos.cargarFoto($scope.persona.foto, $scope.uploader);


          $scope.Guardar=function(){
            //pregunto si el primero elemento de la cola de fotos es igual a 'pordefecto.png'
                    if ($scope.uploader.queue[0].file.name != 'porDefecto.png') {
                      var nombreFoto = $scope.uploader.queue[0].file.name;
                      $scope.persona.foto = nombreFoto;
                    }


                    //cuando la subida de la imagen es success carga la persona
                    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {


                        $http.post('http://localhost/Angular_PHP_ABM_Persona-ngrepeat/Datos/intertarPersona/', {persona: $scope.persona})
                        .then(function(respuesta) {       
                          //aca se ejetuca si retorno sin errores        
                          console.log(respuesta.data);

                        },function errorCallback(response) {        
                          //aca se ejecuta cuando hay errores
                          console.log( response);           
                        });

                    };



                    $scope.uploader.uploadAll();

                  	console.log("persona a guardar:");
                    console.log($scope.persona);



          

          }
});












// CONTROLLER GRILLA

app.controller('controlGrilla', function($scope, $http, $state, $auth, factoryPersona) {
  	$scope.DatoTest="**grilla**";

  console.log(factoryPersona.nombreApellido);

    factoryPersona.mostrarNombre("otro").then(function(respuesta){
        $scope.ListadoPersonas=respuesta;
    });



// --------- FUNCION BORRAR
 	$scope.Borrar=function(persona){
		console.log("borrar"+persona);



    $http.post("PHP/nexo.php",{ datos:{accion :"borrar",persona:persona} },{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
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


 	}

});




// CONTROLLER MODIFICAR

app.controller('controlModificar', function($scope, $http, $state, $stateParams, FileUploader, serviceCargadorDeFotos) {
  $scope.DatoTest="**Modificar**";


      $scope.uploader = new FileUploader({url: 'php/nexo.php'});
      $scope.uploader.queueLimit = 1; 


  $scope.persona={};
  $scope.persona.id = $stateParams.id;
  $scope.persona.nombre= $stateParams.nombre ;
  $scope.persona.dni= $stateParams.dni ;
  $scope.persona.apellido= $stateParams.apellido ;
  $scope.persona.foto= $stateParams.foto ;


    serviceCargadorDeFotos.cargarFoto($scope.persona.foto, $scope.uploader);



//FUNCION GUARDAR DEL MODIFICAR
  $scope.Guardar = function(){


          if ($scope.uploader.queue[0].file.name != 'porDefecto.png') {
            var nombreFoto = $scope.uploader.queue[0].file.name;
            $scope.persona.foto = nombreFoto;
          }


          //cuando la subida de la imagen es success carga la persona
          $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
               //console.info('onSuccessItem', fileItem, response, status, headers);

               $http.post('PHP/nexo.php', { datos: {accion:"modificar", persona:$scope.persona} })
                .then(function(respuesta) {       

                       console.log("Persona a Modificada con éxito! -->");
                      // console.log($scope.persona);
                       //$scope.unaPersona = respuesta.data.persona;
                       console.log(respuesta.data);
                       $state.go("grilla");

                  },function errorCallback(response) {
                       $scope.unaPersona= [];
                      console.log(response);

                 });


          };
          $scope.uploader.uploadAll();


  }







});

app.service('serviceCargadorDeFotos', function($http, FileUploader){

  this.cargarFoto= function(nombreDeFoto, uploader){
    var direccion = "fotos/" + nombreDeFoto;

    $http.get(direccion,{responseType:"blob"})
    .then(
      function(respuesta){
        var mimeType = respuesta.data.type;
        var archivo = new File([respuesta.data],direccion,{type:mimeType});
        var fotoObtenida = new FileUploader.FileItem(uploader,{});
        fotoObtenida._file = archivo;
        fotoObtenida.file = {};
        fotoObtenida.file = new File([respuesta.data],nombreDeFoto,{Type:mimeType}); //converti la foto en un streaming

        uploader.queue.push(fotoObtenida);
    });    
  }

});

app.factory('factoryPersona',function(servicioUsuario){

    var persona={
      nombre:'Leandro',
      nombreApellido:'Leandro Cannarozzi',
      mostrarNombre:function(dato){
          this.nombre=dato;
          return servicioUsuario.retornarPersonas().then(function(respuesta){
                  return respuesta;

          });
          //console.log("Este es mi nombre: "+dato);
      }
  };
    return persona;
});

app.service('servicioUsuario',function($http){
var listado;

  this.retornarPersonas=function(){
      return  $http.get('http://localhost/Angular_PHP_ABM_Persona-ngrepeat/Datos/personas/')
        .then(function(respuesta) {       

          //$scope.ListadoPersonas = respuesta.data.listado;
          return respuesta.data;

         //console.log(respuesta.data);

      });

  };


});

app.controller('controlGrillafiltro', function($scope, $http, $state, $auth, factoryPersona, cienDatos) {
    
  console.info(cienDatos);
  $scope.ListadoPersonas=cienDatos;

  $scope.filtrarPorMoneda=function(valorActual, valorEsperado){

    if(valorActual.indexOf(valorEsperado)===0)
    {
      return true;
    }
    else
    {
      return false;
    }

    //console.info("valores", valorEsperado, valorActual);

    

  }




});
