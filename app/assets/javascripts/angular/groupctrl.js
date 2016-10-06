angular.module('biomodelos')
    .controller('groupCtrl' , ['$scope', function($scope) {
    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

}]);

angular.module('biomodelos').directive('arrow', function(){ 
  console.log("Entre selectable");
  var select = function(element) {
  	if(element.hasClass('rotatearr'))
  		element.removeClass('rotatearr');
  	else
  		element.addClass('rotatearr');
  }
  return {
    
    link : function(scope, element, attrs){
      
       element.on('click', function(){
         select(element);
       });
       
    }
  }
});