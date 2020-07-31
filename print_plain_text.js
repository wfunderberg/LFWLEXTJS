// Title: Plain Text Print for WebLink 9.x
// About: Creates a toolbar button to allow a WebLink user to print plain text pages
// Version: 1.0 (American date format)
// Date: 05/11/2016 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// Note: Permission given to use this script in Laserfiche WebLink 9.x if header lines are left unchanged.
// Install: Place print_plain_text.js file in the Laserfiche WebLink script folder. Open up
//          the DocView.aspx file in an editor and add the following code before the </body> element:
//
//          <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/print_plain_text.js")%>"></script>
//
//          Save DocView.aspx and refresh the page
$(document).ready(function () {
    var html = '<a href="javascript:void(0);" class="PageToolbarLink" id="PrintText" runat="server" rel="nofollow" title="Print (as Plain Text)"><div class="ToolbarIconWrapper"><div class="DocumentRightPanelToolbarIcon PrintIcon" id="PrintTextButton" runat="server" title="Print (as Plain Text)" /></div><span>TXT</span></a>';
    $(html).insertBefore('#SendEmailLink');
    $('#PrintText').click(function () { print_plain_text(); });
});

function print_plain_text() {
    var a = '';

    $('.TextLayer').each(function (i) {
        var b = ($(this).html());
        var c = b.indexOf('This page contains no text.') > -1;
        if (!c)
            a += ($(this).html());
    });

    if (a.length > 0) {
        var b = $(a);
        b.print();
    } else {
        alert('There was no text found to print or you are not viewing this document in Plain Text Mode.');
    }
}

//https://gist.github.com/btd/2390721
// Create a jquery plugin that prints the given element.
jQuery.fn.print = function () {
    // NOTE: We are trimming the jQuery collection down to the
    // first element in the collection.
    if (this.size() > 1) {
        this.eq(0).print();
        return;
    } else if (!this.size()) {
        return;
    }

    // ASSERT: At this point, we know that the current jQuery
    // collection (as defined by THIS), contains only one
    // printable element.

    // Create a random name for the print frame.
    var strFrameName = ("printer-" + (new Date()).getTime());

    // Create an iFrame with the new name.
    var jFrame = $("<iframe name='" + strFrameName + "'>");

    // Hide the frame (sort of) and attach to the body.
    jFrame
    .css("width", "1px")
    .css("height", "1px")
    .css("position", "absolute")
    .css("left", "-9999px")
    .appendTo($("body:first"))
    ;

    // Get a FRAMES reference to the new frame.
    var objFrame = window.frames[strFrameName];

    // Get a reference to the DOM in the new frame.
    var objDoc = objFrame.document;

    // Grab all the style tags and copy to the new
    // document so that we capture look and feel of
    // the current document.

    // Create a temp document DIV to hold the style tags.
    // This is the only way I could find to get the style
    // tags into IE.
    var jStyleDiv = $("<div>").append(
    $("style").clone()
    );

    // Write the HTML for the document. In this, we will
    // write out the HTML of the current element.
    objDoc.open();
    objDoc.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
    objDoc.write("<html>");
    objDoc.write("<body>");
    objDoc.write("<head>");
    objDoc.write("<title>");
    objDoc.write(document.title);
    objDoc.write("</title>");
    objDoc.write(jStyleDiv.html());
    objDoc.write("</head>");
    objDoc.write(this.html());
    objDoc.write("</body>");
    objDoc.write("</html>");
    objDoc.close();

    // Print the document.
    objFrame.focus();
    objFrame.print();

    // Have the frame remove itself in about a minute so that
    // we don't build up too many of these frames.
    setTimeout(
    function () {
        jFrame.remove();
    },
    (60 * 1000)
    );
}
