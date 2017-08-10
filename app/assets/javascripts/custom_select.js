var _CustomSelectModule = function() {

	/**
 	* Init the custom select elements.
	* Taken from: http://jsfiddle.net/tovic/ZTHkQ/
	*/
	var init = function() {
		$('select').each(function(){
			// Cache the number of options
		    var $this = $(this), numberOfOptions = $(this).children('option').length;
		  	
		  	// Hides the select element
		    $this.addClass('select-hidden');
		    // Wrap the select element in a div 
		    $this.wrap('<div class="select"></div>');
		    // Insert a styled div to sit over the top of the hidden select element
		    $this.after('<div class="select-styled"></div>');

		    // Cache the styled div
		    var $styledSelect = $this.next('div.select-styled');
		    // Show the first select option in the styled div
		    $styledSelect.text($this.children('option').eq(0).text());
		  	// Insert an unordered list after the styled div and also cache the list
		    var $list = $('<ul />', {
		        'class': 'select-options'
		    }).insertAfter($styledSelect);
		  	
		  	// Insert a list item into the unordered list for each select option
		    for (var i = 0; i < numberOfOptions; i++) {
		        $('<li />', {
		            text: $this.children('option').eq(i).text(),
		            rel: $this.children('option').eq(i).val()
		        }).appendTo($list);
		    }
		  	
		  	// Cache the list items
		    var $listItems = $list.children('li');
		  	// Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
		    $styledSelect.click(function(e) {
		        e.stopPropagation();
		        $('div.select-styled.active').each(function(){
		            $(this).removeClass('active').next('ul.select-options').hide();
		        });
		        $(this).toggleClass('active').next('ul.select-options').toggle();
		    });
		  	
		  	// Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
		  	// Updates the select element to have the value of the equivalent option
		    $listItems.click(function(e) {
		        e.stopPropagation();
		        $styledSelect.text($(this).text()).removeClass('active');
		        $this.val($(this).attr('rel'));
		        $list.hide();
		        $this.trigger('change'); //Change the hidden select
		        //console.log($this.val());
		    });
		  	// Hides the unordered list when clicking outside of it
		    $(document).click(function() {
		        $styledSelect.removeClass('active');
		        $list.hide();
		    });
		});
	}

	/**
 	* Allows to load an array into a custom select element.
	* @param {string} auxSelect - ID of the auxiliary element of the custom select.
	* @param {array} filterValues - Array with the values to be loaded.
	*/
	var selectValues = function(auxSelect, filterValues){
			$(auxSelect).html('<option value="">- Categoria -</option>');
			if(filterValues != ""){
				$.each(filterValues, function (index, value) {
		    		$(auxSelect).append($('<option/>', { 
		        		value: value,
		        		text : value 
		    		}));
				});
			}
			var $customSelectBox = $(auxSelect).parent().find(".select-styled"),
				$customSelectOptions = $(auxSelect).parent().find(".select-options");
			
			$customSelectBox.text($(auxSelect).children('option').eq(0).text());
			$customSelectOptions.html("");
			for (var i = 0; i < $(auxSelect).children('option').length; i++) {
			        $('<li />', {
			            text: $(auxSelect).children('option').eq(i).text(),
			            rel: $(auxSelect).children('option').eq(i).val()
			        }).appendTo($customSelectOptions);
			}
			$customSelectOptions.children('li').click(function(e) {
			        e.stopPropagation();
			        $customSelectBox.text($(this).text()).removeClass('active');
			        $(auxSelect).val($(this).attr('rel'));
			        $customSelectOptions.hide();
			        $(auxSelect).trigger('change'); //Change the hidden select
			});
			$(document).click(function() {
			        $customSelectBox.removeClass('active');
			        $customSelectOptions.hide();
			 }); 
	}

	return{
		init:init,
		selectValues: selectValues
	}
}();

$(document).ready(function() {
	_CustomSelectModule.init();
});