// Title: Disqus for Laserfiche WebLink
// About: Integrates Disqus commenting system for documents within Laserfiche WebLink.
// Version: 1.0 (American date format)
// Date: 06/23/2016 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// Disqus Quick Start Guide: https://help.disqus.com/customer/portal/articles/466182-quick-start-guide
// Note: Permission given to use this script in Laserfiche WebLink 9.x if header lines are left unchanged.
// Install: Place disqus.js file in the Laserfiche WebLink script folder. Open up
//          the DocView.aspx file in an editor and add the following code before the </body> element:
//
//          <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/disqus.js")%>"></script>
//
//          Save DocView.aspx and refresh the page
var disqus_account_url = '//cityofaikensc.disqus.com/embed.js';
var disqus_comment_count_url = '//cityofaikensc.disqus.com/count.js';
var comments_dialog_id = 'CommentsDialog';
var comments_dialog_width = 640;
var comments_dialog_height = 430;
var comments_dialog_title = 'Comments';
var disqus_entry_identifier = '';


$(window).load(function () {

    disqus_entry_identifier = DocViewer._docInfo.DBID + '-' + DocViewer._docInfo.Id;

    //Create the HTML for the Comments Dialog Box and inject it before the Laserfiche FOG div
    $(comments_dialog(comments_dialog_width, comments_dialog_height, comments_dialog_title, comments_dialog_id)).insertBefore('#fog');
    //$(commments_link()).insertAfter('#TextImageSeparator');
    $('#TheFieldDisplay_DisplayDiv').prepend('<div tabindex="0" role="complementary" class="EntryComments"><div class="FieldsSectionTitle"><a onclick="ToggleSectionVisByClass(\'CommentsSectionCollapsible\',\'__CommentsExpando\');" aria-expanded="true" aria-haspopup="true" href="javascript:void(0);" class="FolderExpandoClass" id="__CommentsExpando" title=""><img alt="Collapse" class="FolderSectionExpando" src="images/new_sprite/upArrowCollapse.png"><span class="FieldsSectionTitleText">Comments</span></a></div><div class="FieldsSectionBody CommentsSectionCollapsible" id="__FieldsPropertiesDataSection" style=""><div tabindex="0" role="complementary" class="DataSection"><div class="FieldDisplayBody"><a id="EntryCommentCount" href="' + window.location.href + '#disqus_thread" onclick="javascript:comments_open()"></a></div></div></div></div>');

    var disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = disqus_entry_identifier;
    };

    (function () {
        var d = document, s = d.createElement('script');
        s.type = 'text/javascript';
        s.src = disqus_account_url;
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);

        var c = d.createElement('script');
        c.async = true;
        c.type = 'text/javascript'
        c.setAttribute('id', 'dsq-count-scr');
        c.src = disqus_comment_count_url;
        (d.body).appendChild(c);

    })();

        if ($('#EntryCommentCount').text() == '' || $('#EntryCommentCount').text() == '0 Comments')
            $('#EntryCommentCount').text('Add a comment');
});

/**
 * Uses jQuery constructor function to center Comments Dialog Box
 * Calls Laserfiche showFog() function to display overlay background
 * Used by <a href> on Page Toolbar in DocView.
 * @return null
 */
function comments_open() {
    $('#' + comments_dialog_id).center();
    showFog();
}

/**
 * Hides Comments Dialog Box from user.
 * Calls Laserfiche hideFog() function to hide overlay background
 * @return null
 */

function comments_close() {
    DISQUSWIDGETS.getCount({ reset: true });
    $('#' + comments_dialog_id).css('display', 'none');
    hideFog();
}

/**
 * Constructs HTML for Comment Dialog Box
 * @param {Number} width : Width of Comments Dialog Box in pixels 
 * @param {Number} height : Heigh of Comments Dialog Box in pixels
 * @param {String} title : Display title of Comments Dialog Box
 * @param {String} id_dialog : Unique name of Comments Dialog Box
 * @return {String} html code
 */
function comments_dialog(width, height, title, id_dialog) {
    return '<div class="PopupDialogBorder" id="' + id_dialog + '" style="display:none;"><div class="PopupDialogTitle"><span>' + title + '</span></div><div><div id="disqus_thread" style="width:' + width + 'px; height:' + height + 'px; overflow-y: auto !important; max-height: ' + width + 'px;"></div><div class="ButtonDiv"><input type="button" class="btn btn-neutral" role="button" id="CommentsDialog_cancel" value="Close" name="CommentsDialog:cancel" onclick="javascript:comments_close();"></div></div></div>';
}

function commments_link() {
    //return '<div class="ViewTextOrImageLinkWrapper"><span class="PageToolbarLink TextButton"><a href="' + window.location.href + '#disqus_thread" onclick="javascript:comments_open()" class="PageToolbarLink TextButton"></a></span></div>';
    return '<div tabindex="0" role="complementary" class="EntryProperties"><div class="FieldsSectionTitle"><a onclick="ToggleSectionVisByClass("PropertiesSectionCollapsible","__FieldsPropertiesExpando");" aria-expanded="true" aria-haspopup="true" href="javascript:void(0);" class="FolderExpandoClass" id="__FieldsPropertiesExpando" title=""><img alt="Collapse" class="FolderSectionExpando" src="images/new_sprite/upArrowCollapse.png"><span class="FieldsSectionTitleText">Comments</span></a></div><div class="FieldsSectionBody PropertiesSectionCollapsible" id="__FieldsPropertiesDataSection" style=""><div tabindex="0" role="complementary" class="DataSection"><div class="FieldDisplayBody"><a href="' + window.location.href + '#disqus_thread" onclick="javascript:comments_open()" class="PageToolbarLink TextButton"></a></div></div></div></div>';
}

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
 * jQuery constructor function used to center a div
 * Used by Comments Dialog Box (comments_open)
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
