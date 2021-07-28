const HomeControllerModule = function() {

  /*
  * Autocomplete function using typeahead.js library
  */
  var typeahead_f = function(){
    var species_search = new Bloodhound({
      datumTokenizer: function (d) {
        return Bloodhound.tokenizers.whitespace(d.species);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url:'/species/search?query=%QUERY',
        replace:
        /* Function to add filter parameters to the URL depending on the checkboxes selected */
        function(url, query) {

          $('.sppbtn input[type="checkbox"]').each(function () {
            if (this.checked && this.value == 1)
              url += '&bmClass1=Anfibios';
            if (this.checked && this.value == 2)
              url += '&bmClass2=Aves';
            if (this.checked && this.value == 3)
              url += '&bmClass3=Invertebrados';
            if (this.checked && this.value == 4)
              url += '&bmClass4=Mamiferos';
            if (this.checked && this.value == 5)
              url += '&bmClass5=Peces';
            if (this.checked && this.value == 6)
              url += '&bmClass6=Reptiles';
            if (this.checked && this.value == 7)
              url += '&bmClass7=Plantas';
          });

          $('.typebtn input[type="checkbox"]').each(function () {
            if (this.checked && this.value == 1)
              url += '&endemic=1';
            if (this.checked && this.value == 2)
              url += '&invasive=1';
            if (this.checked && this.value == 3)
              url += '&enPeligro=1';
          });

          return url.replace('%QUERY', query);
        }
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
      displayKey: function (species) {
        return species.species;
      },
      source: species_search.ttAdapter()
    }).bind('typeahead:select', function(ev, datum) {
      $("#species_id_home").val(datum.taxID);
      $("#species_id").val(datum.taxID);
    }).bind('typeahead:active', function(ev) {
      $("#species_id_home").val(0);
      $("#species_id").val(0);
    });
  };

  var google_charts_f = function(){
    $.post( "/models/models_stats").done(function(data) {
      _drawCharts(data);
    });

    function _drawCharts(stats){
    // Check if allgraphs class exists to Draw the charts. Avoids container errors.
      if($(".allgraphs").length){
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(genericDraw(1, 'donutmam'));
        google.charts.setOnLoadCallback(genericDraw(2, 'donutave'));
        google.charts.setOnLoadCallback(genericDraw(6, 'donutrep'));
        google.charts.setOnLoadCallback(genericDraw(3, 'donutanf'));
        google.charts.setOnLoadCallback(genericDraw(0, 'donutpec'));
        google.charts.setOnLoadCallback(genericDraw(4, 'donutinv'));
        google.charts.setOnLoadCallback(genericDraw(5, 'donutpla'));

        var options_chart = {
          titlePosition: 'none',
          pieHole: 0.7,
          backgroundColor: 'transparent',
          legend: {position: 'none'},
          chartArea:{left:12,top:12,width:'120',height:'120'},
          pieSliceBorderColor: 'none',
          pieStartAngle: '65',
          slices: {0: {color: '#25b19e'}, 1: {color: '#e3af24'}, 2: {color: '#db3f2a'}},
          sliceVisibilityThreshold: '0',
          fontSize: '12',
          pieSliceText: 'none',
          tooltip: {isHtml: true, textStyle: {color: '#fff'}}
        };

        function genericDraw (idx, donutId) {
          return function () {
            var developingModel = stats[idx]["developingModels"] ? stats[idx]["developingModels"] : 0;
            var publishedModel = stats[idx]["publishedModels"] ? stats[idx]["publishedModels"] : 0;
            var validatedModel = stats[idx]["validModels"] ? stats[idx]["validModels"] : 0;
            var statisticModel = stats[idx]["statisticModels"] ? stats[idx]["statisticModels"] : 0;
            var noModel = stats[idx]["totalSpecies"]
              - (developingModel + publishedModel + validatedModel + statisticModel);
            var data = google.visualization.arrayToDataTable([
              ['Estado del modelo', 'Número de spp.'],
              ['Sin Modelo', noModel],
              ['Modelos en desarrollo', developingModel],
              ['Modelos validados', validatedModel],
              ['Modelos publicados', publishedModel],
              ['Modelos estadísticos', statisticModel],
              ]);

            var chart = new google.visualization.PieChart(document.getElementById(donutId));
            chart.draw(data, options_chart);
          }
        }

        $("#mam_lbl").html(stats[1]["totalSpecies"]);

        $("#av_lbl").html(stats[2]["totalSpecies"]);

        $("#rep_lbl").html(stats[6]["totalSpecies"]);

        $("#anf_lbl").html(stats[3]["totalSpecies"]);

        $("#pec_lbl").html(stats[0]["totalSpecies"]);

        $("#inv_lbl").html(stats[4]["totalSpecies"]);

        $("#pla_lbl").html(stats[5]["totalSpecies"]);
      }
    }
  };

  return { typeahead_f, google_charts_f };
}();

$(document).ready(function() {
  /* Add or remove class to show the selected element on license type */
  $("#class_checker input:checkbox").on('click', function() {
    var $box = $(this),
    box_val = "";
    if ($box.is(":checked")) {
    // the name of the box is retrieved using the .attr() method
    // as it is assumed and expected to be immutable
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    // the checked state of the group/box on the other hand will change
    // and the current value is retrieved using .prop() method
    $(group).prop("checked", false);
    $box.prop("checked", true);
    box_val = $box.val();
    $("#class_checker label").addClass("nonchecked");
    $box.parent().removeClass("nonchecked");
  }
  });

  /* License selection checkbox */
  $("#cc_licenses input:checkbox").on('click', function() {
    var $box = $(this);
    if ($box.is(":checked")) {
      $("#publication_cc_license").val($box.val());
    }
  });

  /* Action to go to a species URL from home */
  $("#searchBtnHome").click(function(e){
    e.preventDefault();
    window.location.href = "/"+ $("#locale_field").val() +"/species/visor?species_id=" + $("#species_id_home").val();
  });
});
