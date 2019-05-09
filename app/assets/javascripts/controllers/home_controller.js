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
        google.charts.setOnLoadCallback(drawChart);
        google.charts.setOnLoadCallback(drawChart2);
        google.charts.setOnLoadCallback(drawChart3);
        google.charts.setOnLoadCallback(drawChart4);
        google.charts.setOnLoadCallback(drawChart5);
        google.charts.setOnLoadCallback(drawChart6);
        google.charts.setOnLoadCallback(drawChart7);

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

        $("#mam_lbl").html(stats[0]["totalSpecies"]);
        function drawChart() {
          var developingModel = stats[0]["developingModels"] ? stats[0]["developingModels"] : 0;
          var pendingValModel = stats[0]["pendingValidation"] ? stats[0]["pendingValidation"] : 0;
          var validatedModel = stats[0]["validModels"] ? stats[0]["validModels"] : 0;
          var noModel = stats[0]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutmam'));
          chart.draw(data, options_chart);
        }

        $("#av_lbl").html(stats[1]["totalSpecies"]);
        function drawChart2() {
          var developingModel = stats[1]["developingModels"] ? stats[1]["developingModels"] : 0;
          var pendingValModel = stats[1]["pendingValidation"] ? stats[1]["pendingValidation"] : 0;
          var validatedModel = stats[1]["validModels"] ? stats[1]["validModels"] : 0;
          var noModel = stats[1]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutave'));
          chart.draw(data, options_chart);
        }
        $("#rep_lbl").html(stats[2]["totalSpecies"]);
        function drawChart3() {
          var developingModel = stats[2]["developingModels"] ? stats[2]["developingModels"] : 0;
          var pendingValModel = stats[2]["pendingValidation"] ? stats[2]["pendingValidation"] : 0;
          var validatedModel = stats[2]["validModels"] ? stats[2]["validModels"] : 0;
          var noModel = stats[2]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutrep'));
          chart.draw(data, options_chart);
        }
        $("#anf_lbl").html(stats[3]["totalSpecies"]);
        function drawChart4() {
          var developingModel = stats[3]["developingModels"] ? stats[3]["developingModels"] : 0;
          var pendingValModel = stats[3]["pendingValidation"] ? stats[3]["pendingValidation"] : 0;
          var validatedModel = stats[3]["validModels"] ? stats[3]["validModels"] : 0;
          var noModel = stats[3]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutanf'));
          chart.draw(data, options_chart);
        }
        $("#pec_lbl").html(stats[4]["totalSpecies"]);
        function drawChart5() {
          var developingModel = stats[4]["developingModels"] ? stats[4]["developingModels"] : 0;
          var pendingValModel = stats[4]["pendingValidation"] ? stats[4]["pendingValidation"] : 0;
          var validatedModel = stats[4]["validModels"] ? stats[4]["validModels"] : 0;
          var noModel = stats[4]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutpec'));
          chart.draw(data, options_chart);
        }
        $("#inv_lbl").html(stats[5]["totalSpecies"]);
        function drawChart6() {
          var developingModel = stats[5]["developingModels"] ? stats[5]["developingModels"] : 0;
          var pendingValModel = stats[5]["pendingValidation"] ? stats[5]["pendingValidation"] : 0;
          var validatedModel = stats[5]["validModels"] ? stats[5]["validModels"] : 0;
          var noModel = stats[5]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutinv'));
          chart.draw(data, options_chart);
        }
        $("#pla_lbl").html(stats[6]["totalSpecies"]);
        function drawChart7() {
          var developingModel = stats[6]["developingModels"] ? stats[6]["developingModels"] : 0;
          var pendingValModel = stats[6]["pendingValidation"] ? stats[6]["pendingValidation"] : 0;
          var validatedModel = stats[6]["validModels"] ? stats[6]["validModels"] : 0;
          var noModel = stats[6]["totalSpecies"] - (developingModel + pendingValModel + validatedModel);
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', noModel],
            ['Modelo en desarrollo', developingModel + pendingValModel],
            ['Modelo validado', validatedModel],
            ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutpla'));
          chart.draw(data, options_chart);
        }
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
