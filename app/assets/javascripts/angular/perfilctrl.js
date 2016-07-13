angular.module('biomodelos')
    .controller('perfilCtrl' , ['$scope', function($scope) {
    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    $scope.isActive = false;
    $scope.activeButton = function() {
    	$scope.isActive = !$scope.isActive;
    };

}]);