// Title: Readable Bytes for Laserfiche WebLink 9.x
// About: Converts the bytes displayed in the "Total document size" column into a more friendly format.
// Version: 1.0 (American date format)
// Date: 05/27/2016 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// Install: Place readable_bytes.js file in the Laserfiche WebLink script folder. Open up
//          the Browse.aspx file in an editor and add the following code before the </body> element:
//
//          <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/readable_bytes.js")%>"></script>
//
//          Save Browse.aspx and refresh the page

// Class name for header title cells
var header_cell_class = ".EntrySorterCell";

// Title of header column that contains the byte information
var header_byte_title = "Total document size";
// Precision of newly formatted byte value (i.e 1 MB, 1.1 MB, 1.11 MB, etc.,)
var format_precision = 0;

$(document).ready(function () {

    //Variable used to indicate column index number
    //NOTE! If ShowDownloadEdocButton is set to True in Browse.aspx then this variable needs to be set to 1.
    var a = 1;
    //Obtain the header cells in the browse table and loop through them until we find the "Total document size" column
    $(header_cell_class).each(function () {
        //Increase column index number variable by 1
        a++;
        //Check to see if this column header text matches the one we want
        console.log($(this).text());
        if ($(this).text() == header_byte_title) {
            //Now that we found the column we want go ahead and go through each cell in the column and format the bytes if found
            $(".DocumentBrowserDisplayTable .DocumentBrowserCell:nth-child(" + a + ")").each(function () {
                //Format the bytes
                var b = format_bytes($(this).text(), format_precision);
                //Clear out exsisting value. This will also remove the 0 from appearing from folders
                $(this).empty();
                //Set the newly formatted text
                $(this).text(b);
            });
        }
    });
});

/**
 * Format given byte value into a more friendly format
 * @param {Number} a : Bytes
 * @param {Number} b : Precision
 * @return {String}
 */
function format_bytes(a, b) {
    if (a != 0) {
        if (isNaN(parseFloat(a)) || !isFinite(a))
            return '-';
        if (typeof b === 'undefined')
            b = 1;

        var c = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        d = Math.floor(Math.log(a) / Math.log(1024));
        e = (a / Math.pow(1024, Math.floor(d))).toFixed(b);
        var f = (e.match(/\.0*$/) ? e.substr(0, e.indexOf('.')) : e) + ' ' + c[d];
        return f;
    }
}
