 $(document).ready(function(){

  var typeahead_f = function(){
      // instantiate the bloodhound suggestion engine
      var species_search = new Bloodhound({
        datumTokenizer: function (d) {
            //console.log("datumTokenizer: " + d)
            return Bloodhound.tokenizers.whitespace(d.species);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          //url:'http://192.168.11.81:3000/BioModelos/species/search/%QUERY',
          url:'http://192.168.11.81:3000/BioModelos/species/search/%QUERY',
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
        displayKey: function (species) {
            return species.species;
        },
        source: species_search.ttAdapter()
      }).bind('typeahead:select', function(ev, datum) {
          $("#species_id_home").val(datum.taxID);
          $("#species_id").val(datum.taxID);
      });
  }();

  var google_charts_f = function(){
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
      // google.charts.setOnLoadCallback(drawChart8);

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

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Estado del modelo', 'Número de spp.'],
          ['Sin Modelo', 400],
          ['Modelo en desarrollo', 30],
          ['Modelo validado', 100],
        ]);

        var chart = new google.visualization.PieChart(document.getElementById('donutmam'));
        chart.draw(data, options_chart);
      }
        function drawChart2() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 1923],
            ['Modelo en desarrollo', 500],
            ['Modelo validado', 100],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutave'));
          chart.draw(data, options_chart);
        }
        function drawChart3() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 400],
            ['Modelo en desarrollo', 30],
            ['Modelo validado', 5],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutrep'));
          chart.draw(data, options_chart);
        }
        function drawChart4() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 400],
            ['Modelo en desarrollo', 30],
            ['Modelo validado', 5],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutanf'));
          chart.draw(data, options_chart);
        }
        function drawChart5() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 400],
            ['Modelo en desarrollo', 30],
            ['Modelo validado', 5],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutpec'));
          chart.draw(data, options_chart);
        }
        function drawChart6() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 400],
            ['Modelo en desarrollo', 30],
            ['Modelo validado', 5],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutinv'));
          chart.draw(data, options_chart);
        }
        function drawChart7() {
          var data = google.visualization.arrayToDataTable([
            ['Estado del modelo', 'Número de spp.'],
            ['Sin Modelo', 400],
            ['Modelo en desarrollo', 30],
            ['Modelo validado', 5],
          ]);

          var chart = new google.visualization.PieChart(document.getElementById('donutpla'));
          chart.draw(data, options_chart);
        }
      }
    }();

    $("#searchBtnHome").click(function(e){
        e.preventDefault();
        window.location.href = "/species/visor?species_id=" + $("#species_id_home").val();
    });



});