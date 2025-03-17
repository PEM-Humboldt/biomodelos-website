const HomeControllerModule = function() {
  /*
  * Autocomplete function using typeahead.js library
  */
    function typeahead_f() {
        var species_search = new Bloodhound({
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.species);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/species/search?query=%QUERY',
                replace:
                    /* Function to add filter parameters to the URL depending on the checkboxes selected */
                    function (url, query) {

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
            }).bind('typeahead:select', function (ev, datum) {
                $("#species_id_home").val(datum.taxID);
                $("#species_id").val(datum.taxID);
            }).bind('typeahead:active', function (ev) {
                $("#species_id_home").val(0);
                $("#species_id").val(0);
            });
    }

    function google_charts_f() {
        $.post("/models/models_stats").done(function (data) {
            _drawCharts(data);
        });

        function _drawCharts(stats) {
            var lang = $("#locale_field").val();
            // Check if allgraphs class exists to Draw the charts. Avoids container errors.
            if ($(".allgraphs").length) {
                google.charts.load("current", { packages: ["corechart"] });
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('mamiferos'), 'donutmam', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('aves'), 'donutave', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('reptiles'), 'donutrep', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('anfibios'), 'donutanf', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('peces'), 'donutpec', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('invertebrados'), 'donutinv', lang));
                google.charts.setOnLoadCallback(genericDraw(findGroupIdx('plantas'), 'donutpla', lang));
                
                var options_chart = {
                    titlePosition: 'none',
                    pieHole: 0.7,
                    backgroundColor: 'transparent',
                    legend: { position: 'none' },
                    chartArea: { left: 12, top: 12, width: '120', height: '120' },
                    pieSliceBorderColor: 'none',
                    pieStartAngle: '65',
                    slices: {
                        0: { color: '#25b19e' },
                        1: { color: '#e3af24' },
                        2: { color: '#db3f2a' },
                        3: { color: '#eb885b' },
                        4: { color: '#1b6875' }
                    },
                    sliceVisibilityThreshold: '0',
                    fontSize: '12',
                    pieSliceText: 'none',
                    tooltip: { isHtml: true, textStyle: { color: '#fff' } }
                };

                function findGroupIdx(name) {
                    return stats.findIndex(function (group) {
                        return group.taxonomicGroup === name;
                    });
                }

                function genericDraw(idx, donutId, lang) {
                    return function () {
                        var developingModel = stats[idx]["developingModels"] ? stats[idx]["developingModels"] : 0;
                        var publishedModel = stats[idx]["publishedModels"] ? stats[idx]["publishedModels"] : 0;
                        var validatedModel = stats[idx]["validModels"] ? stats[idx]["validModels"] : 0;
                        var statisticModel = stats[idx]["statisticModels"] ? stats[idx]["statisticModels"] : 0;
                        var noModel = stats[idx]["totalSpecies"] - (developingModel + publishedModel + validatedModel + statisticModel);

                        var labels = {
                            en: ['Model Status', 'Number of spp.', 'No Model', 'Developing Models', 'Validated Models', 'Published Models', 'Statistical Models'],
                            es: ['Estado del Modelo', 'Número de spp.', 'Sin Modelo', 'Modelos en Desarrollo', 'Modelos Validados', 'Modelos Publicados', 'Modelos Estadísticos']
                        };

                        var data = google.visualization.arrayToDataTable([
                            [labels[lang][0], labels[lang][1]],
                            [labels[lang][2], noModel],
                            [labels[lang][3], developingModel],
                            [labels[lang][4], validatedModel],
                            [labels[lang][5], publishedModel],
                            [labels[lang][6], statisticModel],
                        ]);
                        
                        var chart = new google.visualization.PieChart(document.getElementById(donutId));
                        chart.draw(data, options_chart);
                    };
                }

                $("#mam_lbl").html(stats[findGroupIdx('mamiferos')]["totalSpecies"]);

                $("#av_lbl").html(stats[findGroupIdx('aves')]["totalSpecies"]);

                $("#rep_lbl").html(stats[findGroupIdx('reptiles')]["totalSpecies"]);

                $("#anf_lbl").html(stats[findGroupIdx('anfibios')]["totalSpecies"]);

                $("#pec_lbl").html(stats[findGroupIdx('peces')]["totalSpecies"]);

                $("#inv_lbl").html(stats[findGroupIdx('invertebrados')]["totalSpecies"]);

                $("#pla_lbl").html(stats[findGroupIdx('plantas')]["totalSpecies"]);
            }
        }
    }
    return { typeahead_f, google_charts_f };
}();

$(document).jquery(function() {
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
    $("#searchBtnHome").on("click",function(e){
        e.preventDefault();
        window.location.href = "/"+ $("#locale_field").val() +"/species/visor?species_id=" + $("#species_id_home").val();
    });
});
