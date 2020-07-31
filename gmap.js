// Title: Google Maps for Laserfiche WebLink 9.x GeoTag Coordinates
// About: Creates clickable links out of any found GeoTag Coordinates and displays them on a Google Map.
// Version: 1.0 (American date format)
// Date: 05/10/2016 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// GeoTag Information: https://www.laserfiche.com/ecmblog/tech-tip-using-geotags-in-the-laserfiche-mobile-app/
// Note: Permission given to use this script in Laserfiche WebLink 9.x if header lines are left unchanged.
// Install: Place gmap.js file in the Laserfiche WebLink script folder. Open up
//          the DocView.aspx file in an editor and add the following code before the </body> element:
//
//          <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/gmap.js")%>"></script>
//
//          Save DocView.aspx and refresh the page

//Google Map Object
var gmap;
//Unique name for Map Dialog div
var map_dialog_id = 'MapDialog';
//Title displayed on Map Dialog div
var map_dialog_title = 'Map';
//Unique name for Google Map div
var map_div_id = 'Map';
//Width of map in pixels
var map_width = 640;
//Heigh of map in pixels
var map_height = 430;
//Zoom value when viewing marker
var marker_zoom = 16;
//Google InfoWindow object
var info_window;
//URL of Google Map JavaScript library
var gmap_url = "https://maps.google.com/maps/api/js";
//Name of targeted div containing coordinates
var div_field_display_name = 'GeoTag Coordinates';
//Name of targeted div containing coordinates div
var div_supplemental_fields_id = '.SupplementalFields';

$(document).ready(function () {

    //Grab the Google Map Javascript library either from cache or from URL
    //$.cachedScript(gmap_url).done(

        //function () {

            //Find the SupplementalFields div elements and grab all the children
            var a = $(div_supplemental_fields_id).children();
            
            //Step through each child
            a.each(function () {
                //Get the text of the current child
                var b = $(this).text();
                // Test to see if this is the child we want
                if (b == div_field_display_name) {
                    //Advance to next child (FieldDisplayValue Class Div) to get the values we want
                    var c = $(this).next();
                    //Turn the values into an array
                    var d = c.text().split('\n');
                    //Test to see if there are values in the array
                    if (d.length > 0) {

                        //Grab the Google Map Javascript library either from cache or from URL
                        $.cachedScript(gmap_url).done(
                            
                            function () {

                                //Create the HTML for the Map Dialog Box and inject it before the Laserfiche FOG div
                                $(map_dialog(map_width, map_height, map_dialog_title, map_dialog_id, map_div_id)).insertBefore('#fog');

                                //Initialize Google Map
                                init_map(map_div_id);

                                //Attach a click event to the map_close function on the "Close" button
                                $('#MapDialog_cancel').click(function () { map_close(); });

                                //Create an empty array to hold our newly created coordinate links
                                var e = [];

                                //Step through each line of found coordinates
                                $.each(d, function (index, value) {
                                    //Split each line of coordinates into an array
                                    var f = value.split(',');
                                    //Create the link html code
                                    var g = '<a href="javascript:map_goto(' + f[0] + ',' + f[1] + ');">' + f[0] + ', ' + f[1] + '</a>';
                                    //Add this new linked coordinate code to the array
                                    e.push(g);
                                    //Create a Google Map Marker from the coordinates
                                    add_map_marker(f[0], f[1], gmap);
                                });

                                //Test to see if we have values in our new html link coordinates array
                                if (e.length > 0) {
                                    //Clear out existing coordinates value in the FieldDisplayValue div
                                    c.empty();
                                    //Flatten the html link coordinates array into a string
                                    var g = e.join('\n');
                                    //Insert the html link coordinates into the FieldDisplayValue div
                                    c.html(g);
                                }
                                //Exit function due to finding coordinates
                                return null
                            });
                    }
                }
        });
});

/**
 * Load a JavaScript file from the server using a GET HTTP request, then execute it.
 * https://api.jquery.com/jquery.getscript/
 * @param {String} url : The URL of the script to load
 * @param {Object} options : Allow user to set any option except for dataType, cache, and url
 * @return {Object} Type: Function( String script, String textStatus, jqXHR jqXHR ) 
 * A callback function that is executed if the request succeeds.
 */
$.cachedScript = function (url, options) {
    options = $.extend(options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });

    return $.ajax(options);
};

/**
 * Initializes Google Map object along with InfoWindow object
 * When initialized the map is hidden from user.
 * @param {String} id : Unique name of div container which will display the map
 * @param {Number} _lat : Optional starting Latitude on map (defaults to 0)
 * @param {Number} _lng : Optional starting Longitude on map (defaults to 0)
 * @param {Number} _zoom : Optional starting Zoom on map (defaults to 0)
 * @return null
 */

function init_map(id, _lat, _lng, _zoom) {

    if (typeof _lat === 'undefined') { _lat = 0; }
    if (typeof _lng === 'undefined') { _lng = 0; }
    if (typeof _zoom === 'undefined') { _zoom = 10; }

    gmap = new google.maps.Map(document.getElementById(id), {
        center: { lat: _lat, lng: _lng },
        zoom: _zoom
    });

    info_window = new google.maps.InfoWindow();

}

/**
 * Adds Google Map Marker to map
 * Attaches click event listener to marker to display Google InfoWindow
 * @param {Number} lat : Latitude 
 * @param {Number} lng : Longitude
 * @param {object} map : Google Map Object
 * @return{object} Marker
 */

function add_map_marker(lat, lng, map) {
    var m = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map
    });

    google.maps.event.addListener(m, 'click', (function (m) {
        return function () {
            info_window.setContent(lat + ', ' + lng);
            info_window.open(map, m);
        }
    })(m));
}

/**
 * Uses jQuery constructor function to center Map Dialog Box
 * Calls Laserfiche showFog() function to display overlay background
 * Calls map_update() function using supplied latitude and longitude values
 * Used by <a href> on coordinates in DocView.
 * @param {Number} lat : Latitude 
 * @param {Number} lng : Longitude
 * @return null
 */

function map_goto(lat, lng) {

    $('#' + map_dialog_id).center();

    showFog();

    map_update(lat, lng, gmap);
}

/**
 * Hides Map Dialog Box from user.
 * Calls Laserfiche hideFog() function to hide overlay background
 * @return null
 */

function map_close() {

    $('#' + map_dialog_id).css('display', 'none');

    hideFog();
}

/**
 * Triggers Google map to resize to ensure visibility along with
 * panning to and setting zoom on map.
 * @param {Number} lat : Latitude 
 * @param {Number} lng : Longitude
 * @param {Object} map : Google Map Object
 * @return null
 */

function map_update(lat, lng, map) {
    google.maps.event.trigger(map, "resize");
    var x = new google.maps.LatLng(lat, lng);
    map.panTo(x);
    map.setZoom(marker_zoom);
}

/**
 * jQuery constructor function used to center a div
 * Used by Map Dialog Box (map_goto)
 * @return {object} 
 */

jQuery.fn.center = function () {
    this.css('display', 'block');
    this.css('z-index', '1020');
    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}

/**
 * Constructs HTML for Map Dialog Box
 * @param {Number} width : Width of Map Dialog Box in pixels 
 * @param {Number} height : Heigh of Map Dialog Box in pixels
 * @param {String} title : Display title of Map Dialog Box
 * @param {String} id_dialog : Unique name of Map Dialog Box
 * @param {String} id_map : Unique name of map display
 * @return {String} html code
 */
function map_dialog(width, height, title, id_dialog, id_map) {
    return '<div class="PopupDialogBorder" id="' + id_dialog + '" style="display:none;"><div class="PopupDialogTitle"><span>' + title + '</span></div><div><div id="' + id_map + '" style="width:' + width + 'px;height:' + height + 'px;"></div><div class="ButtonDiv"><input type="button" class="btn btn-neutral" role="button" id="MapDialog_cancel" value="Close" name="MapDialog:cancel" onclick="javascript:map_close();"></div></div></div>';
}
