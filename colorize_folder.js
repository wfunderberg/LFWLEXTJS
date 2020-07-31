// Title: Colorize Folder for Laserfiche WebLink 9.x
// About: Changes the color of the folder in Browse.aspx based upon the Template name
// Version: 1.0 (American date format)
// Date: 04/11/2017 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// Note: Permission given to use this script in Laserfiche WebLink 9.x if header lines are left unchanged.
// Install: Please note that the column "Template name" must be active and visible in order for this to work
// properly! Place colorize_folder.js file in the Laserfiche WebLink script folder. Open up
// the Browse.aspx file in an editor and add the following code before the </body> element:
//
// <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/colorize_folder.js")%>"></script>
// 
// Save Browse.aspx and refresh the page


//Array that holds template names and color id. [Name of Template, Color ID]
var template_colors = [
['Website General','16'],
['Records General','5'],
['Plans General','1'],
['Phone General','18']
]
//Name of Template column
var template_column_name = "Template name";
//Option to hide Template column
var show_template_column = true;
//Array containing all the colors that are avaible in Laserfiche Administrator when assigning a color to a template.
var _colors = [
'0 0',
'-21 -202',
'-21 -2',
'-21 -102 ',
'-21 -122 ',
'-21 -182',
'-21 -22',
'-21 -222',
'-21 -382',
'-21 -142',
'-21 -162',
'-21 -42',
'-21 -62',
'-21 -442',
'-21 -242',
'-21 -262',
'-21 -342',
'-21 -362',
'-21 -422',
'-21 -462',
'-21 -282',
'-21 -322',
'-21 -502',
'-21 -402',
'-21 -482',
'-21 -302'];
//Index of template column when found in the table
var template_col_index = -1

$(document).ready(function () {
//First check to see if the template column is avaialble
var has_template_col = has_column(template_column_name);
//We found the column so let's continue
if(has_template_col != -1){
	//Get all the rows in the browse table
	$(".DocumentBrowserDisplayTable").find("tr").each(
		function (rowIndex){
			var r = $(this);
			//Get all the cells in the current row with the class .DocumentBrowserCell
			r.find('.DocumentBrowserCell').each(function (index,c) {
            //Get the cell with the template name
			if(index == template_col_index && c.textContent.length > 0){
				
				var selected_color;
				//With the name that we found go through the template color array and find the one that matches
				for( var i = 0, len = template_colors.length; i < len; i++ ) {
					if( template_colors[i][0] === c.textContent ) {
						//Get the color id of the matched template name
						selected_color = parseInt(template_colors[i][1]);
						//Get the folder icon of the current row
						r.find('.DocumentBrowserNameImage').each(function(i){
							//Make sure it's a folder
							if($(this).attr('src') === 'images/iFolderClosed.gif'){
								//Manipulate the folder image css and source element
								$(this).css({
									'background':'url(images/template_colors/sprites/IconSet1.png) no-repeat',
									'background-position':_colors[selected_color],
									'display':'inline-block',
									'width':'16',
									'height': '16'
								});
								$(this).attr('src','images/spacer.gif');
							}
						});						
						break;
					}
				}				
			}
        });
}
);
}
});
/**
 * Iterates through the header of the .DocumentBrowserDisplayTable
 * to see if the given name matches any of the header cells.
 * @param {String} col_name : Name of column that should match
 * @return boolean
 */
function has_column (col_name) {
    var x = false;
	//Get all the TH cells in the THEAD section of .DocumentBrowserDisplayTable
	$(".DocumentBrowserDisplayTable").find(".EntrySorterCell").each(function (index,col) {
        //Get the text content of the current cell
		var col_text = col.textContent;
        //Check to see if they match
		if (col_text.toLowerCase() === col_name.toLowerCase()) {
			//Get the current index number
			template_col_index = index;
			//We found the match so we will return true
			x = true;
			//Hide the entire template column
			if(!show_template_column){
				//Hide the TH
				$(this).hide();
				//Hide all of the TD in .DocumentBrowserDisplayTable that are at position n
				//If ShowDownloadEdocButton is set to True then we need to add 2 to the current index
				if($('.DocumentBrowserDisplayTable tbody td:not(.DocumentBrowserCell)').length > 0){
					$('.DocumentBrowserDisplayTable td.DocumentBrowserCell:nth-child('+(index+2)+')').hide();
				}else{
					$('.DocumentBrowserDisplayTable td.DocumentBrowserCell:nth-child('+(index+1)+')').hide();	
				}
				}
			//Exit out of loop
			return false;
		}
    });

    return x;
};
