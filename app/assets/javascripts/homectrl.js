angular.module('biomodelos', ['ngAnimate'])
    .controller('homeCtrl', function ($interval) { 

    var vm = this

    var slides = [
       "url(/assets/grillo.jpg)",
       "url(/assets/rana.jpg)",
       "url(/assets/orquidea.jpg)"
    ];

    vm.slide = slides[0]; 
    $interval(function(){
      if(vm.slide == slides[0])
          vm.slide = slides[1];
      else if(vm.slide == slides[1])
          vm.slide = slides[2];
      else 
      	vm.slide = slides[0];
    }, 7000, 0);

});