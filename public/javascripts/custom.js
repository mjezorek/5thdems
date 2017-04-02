
(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {

            /*====================================
              LOAD APPROPRIATE MENU BAR
              ======================================*/
              $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });



          },

          initialization: function () {
            mainApp.main_fun();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.main_fun();
    });

}(jQuery));

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
function getPrecinct() {
    $("#ldwarning").hide();
    var street = $('#address').val();
    var url = "http://gismaps.kingcounty.gov/arcgis/rest/services/Address/Address_Points_locator/GeocodeServer/findAddressCandidates?Street=" + street + "&f=json&outSR=%7B%22wkid%22%3A102100%7D&outFields=Loc_name";
    $.getJSON(url, function(data) {
        var x = data['candidates'][0]['location']['x'];
        var y = data['candidates'][0]['location']['y'];
        var dataURL = "http://gismaps.kingcounty.gov/arcgis/rest/services/Districts/KingCo_Electoral_Districts/MapServer/identify?f=json&geometry=%7B%22points%22%3A%5B%5B" + x + "%2C" + y + "%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&tolerance=3&returnGeometry=false&mapExtent=%7B%22xmin%22%3A-13668004.150429394%2C%22ymin%22%3A5927354.86630494%2C%22xmax%22%3A-13455814.959909849%2C%22ymax%22%3A6110497.986076133%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&imageDisplay=400%2C400%2C96&geometryType=esriGeometryMultipoint&sr=102100&layers=all%3A0%2C1%2C2%2C3%2C4"
        $.getJSON(dataURL, function(data) {
            var p = data['results'][0]['value'];
            var ld = data['results'][3]['value'];
            var cd = data['results'][2]['value'];
            if(ld != "5") {
                $("#ldwarning").html("This member is not in the 5th LD! They are in the " + ordinal_suffix_of(ld) + " LD. Setting Membership to Associate");
                $("#ldwarning").addClass("alert alert-danger")
                $("#ldwarning").show();
                $("#membership_type option:contains('Associate')").each(function() {
                    if($(this).text() == "Associate (non-voting)") {
                        $(this).attr('selected', 'selected');
                        return false;
                    }
                    return true;
                });
            }
            var precinct = $("#residential_precinct");
            $("#residential_precinct option:contains(" + p + ")").each(function() {
                if ($(this).text() == p) {
                    $(this).attr('selected', 'selected');
                    return false;
                }
                return true;
            });
        });
    });


}

$( "#datepicker" ).datepicker();
  $('#roles').multiselect({
    columns: 1,
    placeholder: 'Select Roles',
});


$('#interests').multiselect({
    columns: 1,
    placeholder: 'Select Roles',
});
$('#family').toggle();

$('#members').dataTable({
            "scrollCollapse": true,
            "bSort": true,
            "paging": true
        });
$('#meetings').dataTable({
            "scrollCollapse": true,
            "bSort": true,
            "paging": true
        });
$('#pdata').dataTable({
            "scrollCollapse": true,
            "bSort": true,
            "paging": true
        });

 $('#datetimepicker1').datetimepicker();

 $('#member_select_list').select2();