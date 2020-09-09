var _utils_bio_module = function() {
	/**
	* Compiles dynamic code that contains Angular directives from outside 
	* Angular.
	* Based on this code https://gist.github.com/umidjons/1fb8ae674df4c71f85cf
	* @param {String} elementStr - String with the selector of the angular element i.e "#visCtrl".
	* @param {Object} domObj - DOM that will contain the new code.
	* @param {String} htmlStr - HTML code that will be inserted.
	*/
	function compileDynamicAngularContent(elementStr, domObj, htmlStr){
		angular.element(elementStr).injector().invoke(['$compile', function($compile){
	            var obj=domObj; // get wrapper
	            var scope=obj.scope(); // get scope
	            // generate dynamic content
	            obj.html(htmlStr);
	            // compile!!!
	            $compile(obj.contents())(scope);
	    }]);
	}
	return{
		compileDynamicAngularContent:compileDynamicAngularContent
	}

}();