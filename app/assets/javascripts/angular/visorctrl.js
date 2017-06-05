angular.module('biomodelos')
    .controller('visorCtrl' , ['$scope','$timeout', function($scope, $timeout) {
        
    $scope.isActive = false;
    $scope.activeButton = function() {
    	$scope.isActive = !$scope.isActive;
    };

    $scope.changeLayer = function (){
      if($scope.corteSlider.value == 'C'){
        $(".modelname").html("Continuo");
        if(!$(".modelname").hasClass("gradient"))
          $(".modelname").addClass("gradient");
      }
      else{
        $(".modelname").html("Umbral: " + $scope.corteSlider.value);
        if($(".modelname").hasClass("gradient"))
          $(".modelname").removeClass("gradient");
      }

      _BioModelosVisorModule.changeThresholdLayer($scope.corteSlider.value);
      //console.log('on change ' + $scope.corteSlider.value); // logs 'on change slider-id'
    }

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
    		],
    		onChange: $scope.changeLayer
    	}
	};

	$scope.yearSlider = {
	    minValue: 'NA',
	    maxValue: 'Hoy',
	    options: {
	        floor: 'NA',
	        ceil: 'Hoy',
	        showTicksValues: true,
	        stepsArray : [
	    		{value: 'NA'},
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

	$scope.resetSlider = function () {
		$scope.yearSlider.minValue = 'NA';
		$scope.yearSlider.maxValue = 'Hoy';
		//Refresh the slider
	    $timeout(function () {
	      $scope.$broadcast('rzSliderForceRender');
	    });
 	};

  $scope.changeThreshold = function (threshold){
      $scope.corteSlider.value = threshold;
      //Refresh the slider
      $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
      });
      $scope.changeLayer();
  }


}]);

angular.module('biomodelos').directive('selectable', function(){ 
  var select = function(element) {
  	if(element.hasClass('visorbtn')){
  		if(element.hasClass('vbtnact'))
  			element.removeClass('vbtnact');
  		else
  			element.addClass('vbtnact');
	}
  	else if(element.hasClass('btnregistros')){
  		if(element.hasClass('regactive'))
  			element.removeClass('regactive');
  		else
  			element.addClass('regactive');
  	}
  	else if(element.hasClass('btnedicion')){
  		if(element.hasClass('edactive'))
  			element.removeClass('edactive');
  		else
  			element.addClass('edactive');
  	}	    
  }
  return {
    
    link : function(scope, element, attrs){
      
       element.on('click', function(){
         select(element);
       });
       
    }
  }
});