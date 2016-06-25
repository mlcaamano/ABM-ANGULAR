angular.module("ABMangularPHP")
.directive("utnDirectivaSaludar", 

    function(){
        return {template: "<h1>Hola Utn Fra</h1>", 
                restrict:'CAE',
                replace: true};
    }
    );

//restrict 'A' para atributo(tags), 'E' para elementos primer caso, 'C' para clases 

angular.module("ABMangularPHP")
.directive("utnBotonMenu", 

    function(){
        return {templateUrl: 'templateBoton.html', 
                restrict:'E',
                replace: true,
                scope:{titulo: '@'}};
    }
);
//ui-grid