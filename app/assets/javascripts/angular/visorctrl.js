angular.module('biomodelos')
    .controller('visorCtrl' , ['$scope', function($scope) {
        
    $scope.isActive = false;
    $scope.activeButton = function() {
    	$scope.isActive = !$scope.isActive;
    };

}]);