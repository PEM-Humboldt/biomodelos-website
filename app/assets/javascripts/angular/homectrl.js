angular.module('biomodelos')
    .controller('homeCtrl', ['$interval', function ($interval) { 
    var vm = this

    var slides = [
       "url(/assets/bg4.jpg)",
       "url(/assets/bg3.jpg)",
       "url(/assets/bg7.jpg)"
    ];

    vm.slide = slides[0]; 
    $interval(function(){
      if(vm.slide == slides[0])
          vm.slide = slides[1];
      else if(vm.slide == slides[1])
          vm.slide = slides[2];
      else 
      	vm.slide = slides[0];
    }, 6000, 0);

}]);