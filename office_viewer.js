//https://view.officeapps.live.com/op/view.aspx?src=<LINKTOEDOC>
//Word: docx, docm, dotm, dotx
//Excel: xlsx, xlsb, xls, xlsm
//PowerPoint: pptx, ppsx, ppt, pps, pptm, potm, ppam, potx, ppsm
//Word and PowerPoint documents must be less than 10MB
//Excel must be less than 5MB

//NOTE: This plugin does not work well with code that always shows the URL via JavaScript.

var mm = "images/office_online_link.gif";

var size_column_name = "Electronic file size";

var img_title = "View this document on Microsoft Office Online";

//If the "Electronic file size" is not available should we create the links anyway?
var show_without_doc_size = false;

//If the "Total document size" is available do you want to show it?
var show_total_document_size_col = true;

//URL of installed Weblink
var weblink_url = "LF_WEBLINK_URL";

$(document).ready(function () {

    var office_docs = ['DOC','DOCX', 'DOCM', 'DOTM', 'DOTX','XLSX', 'XLSB', 'XLS', 'XLSM', 'PPTX', 'PPSX', 'PPT', 'PPS', 'PPTM', 'POTM', 'PPAM', 'POTX', 'PPSM'];
    var has_doc_size_col = document_size_available();

    var doc_ppt_max = [10485760,"10MB"];
    var xls_max = [5242880, "5MB"];
    var office_online_link = "https://view.officeapps.live.com/op/view.aspx?src={0}{1}";

    $(".ElectronicFileIcon").each(function () {

        var create_link = false;

        var class_attribute = $(this).attr('class');
        var entry_extension = class_attribute.match("Edoc(.*)");
        if (entry_extension !== null) {
            var ext = entry_extension[1];
            if (office_docs.indexOf(ext) != -1) {
                var e = $(this).parent().parent();

                if (has_doc_size_col != -1) {
                
                    var ee = e.parent().parent().children().each(function () {
                    var ff = $(this).attr("aria-label");
                    if (ff != null) {
                        var entry_size = ff.match(size_column_name + "(.*)");
                        //console.log(entry_size);
                        if (entry_size != null) {
                            var doc_size = entry_size[1];
                            console.log(entry_size);
                            var entry_doc_type = ext.substring(0, 1);

                            if (is_office_entry)
                                create_link = true;

                            var office_doc = office_entry_type(ext);

                            if (isNumeric(doc_size)) {
                                if (office_doc == "word" || office_doc == "powerpoint") {
                                    create_link = (doc_size <= doc_ppt_max[0])
                                } else if (office_doc == "excel") {
                                    create_link = (doc_size <= xls_max[0]);
                                }
                            }
                        }
                    }
                });
            }



                    if (((has_doc_size_col == -1 && show_without_doc_size)) || (create_link != null && create_link != false)) {

                        var f = e.attr("href");
                        var g = e.children().children().eq(1).text();
                        var j = office_online_link.format(weblink_url, f);
                        var k = build_office_online_link(j, g, ext);
                        e.after(k);
                }
                
            }
        }

    });

});

function is_office_entry(s) {
    return s.startsWith("D", 0) || s.startsWith("P", 0) || s.startsWith("X", 0);
}

function office_entry_type(s) {
    if(s.startsWith("D",0)){
        return "word"
    }else if(s.startsWith("P",0)){
        return "powerpoint"
    }else if (s.startsWith("X")){
        return "excel"
    }
    }

function isNumeric(n) {
    //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function document_size_available () {
    var col_index = -1;
    //NOTE: If "ShowDownloadLink" is active then set this variable to 1
    var child_index = 0;
    $(".EntrySorterCell").each(function () {
        col_index += 1;
        child_index += 1;
        var col_text = $(this).text();
        if (col_text.indexOf(size_column_name) != -1) {

            /*if (!show_total_document_size_col) {
                $(".DocumentBrowserDisplayTable td:nth-child(" + child_index + "),th:nth-child(" + child_index + ")").hide();
            }
            return false;
            */
        } else {
            col_index = -1;
        }
    });

    return col_index;
};

function build_office_online_link(link,entry_name,entry_ext) {
    //Due to WebLink changing the structure of the URL whenever the
    //"Other electronic documents" in View Document Options is checked we must
    //manually construct the URL to ensure that MSO Online can read it
    //"Other electronic documents" OFF = https://xxxxxxxx/WebLink/0/edoc/240614/Fiscal%20Year%202013-14%20DOCX.docx
    //"Other electronic documents" ON = https://xxxxxxxx/WebLink/0/doc/240829/Page1.aspx


    var enc_entry_name = encodeURI(entry_name);
    link = link.replace("/doc/", "/edoc/");
    link = link.replace("Page1.aspx",enc_entry_name) + "." + entry_ext;
    
    var el_link = $("<a/>", { id: guid(), href: "javascript:void(0);", class: "DocumentBrowserNameLink", onclick: "view_msod('" + link + "');", text: "s" });
    var el_img = $("<img/>", { id: guid(), class: "DocumentBrowserNameImage ElectronicFileIcon", src: mm, title: img_title });
    var el_nobr = $("<nobr/>");
    el_nobr.html(el_img);
    el_link.html(el_nobr);
    return el_link;
}
function guid() {
    var a = function () {return (((1 + Math.random()) * 0x10000) | 0).toString(16).toUpperCase().substring(1);};
    return ("MSO"+ a() + a());
}

String.prototype.format = function () {
    var a = this;
    for (var i = 0; i < arguments.length; i++) {
        var b = new RegExp("\\{" + i + "\\}", "gm");
        a = a.replace(b, arguments[i]);
    }
    return a;
}

function view_msod(o) {
    window.open(o);
}
function format_bytes(bytes,precision){
    if (bytes != 0) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
            return '-';
        if (typeof precision === 'undefined')
            precision = 1;

        var units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        number = Math.floor(Math.log(bytes) / Math.log(1024));
        val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
        return (val.match(/\.0*$/) ? val.substr(0, val.indexOf('.')) : val) + ' ' + units[number];
    }
}
