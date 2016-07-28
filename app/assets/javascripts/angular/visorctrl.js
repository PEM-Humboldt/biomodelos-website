angular.module('biomodelos')
    .controller('visorCtrl' , ['$scope', function($scope) {
        
    $scope.isActive = false;
    $scope.activeButton = function() {
    	$scope.isActive = !$scope.isActive;
    };

    $scope.corteSlider = {
    	value : 5,
    	options: {
    		showTicksValues: true,
    		stepsArray : [
    		{value: 'C'},
    		{value: '0%'},
    		{value: '10%'},
    		{value: '20%'},
    		{value: '30%'}
    		]
    	}
	};

	$scope.yearSlider = {
	    minValue: '1980',
	    maxValue: 'Hoy',
	    options: {
	        floor: 0,
	        ceil: 'Hoy',
	        showTicksValues: true,
	        stepsArray : [
	    		{value: '0'},
	    		{value: '1900'},
	    		{value: '1950'},
	    		{value: '1970'},
	    		{value: '1980'},
	    		{value: '1990'},
	    		{value: '2000'},
	    		{value: '2005'},
	    		{value: '2010'},
	    		{value: 'Hoy'}
	    	]
	    }
	};


}]);