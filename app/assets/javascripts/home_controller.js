var ready;

ready = function() {
  // instantiate the bloodhound suggestion engine
  var species_search = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('sci_name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url:'/species/autocomplete.json?query=%QUERY',
      wildcard:'%QUERY'
    },
  });

  // initialize the bloodhound suggestion engine
  species_search.initialize();

  // instantiate the typeahead UI
  $('#search_form').typeahead({
      minLength: 3,
      highlight: true
  }, 
  {
    displayKey: 'sci_name',
    source: species_search.ttAdapter()
  });
   }

 $(document).ready(ready);
 $(document).on('page:load', ready);