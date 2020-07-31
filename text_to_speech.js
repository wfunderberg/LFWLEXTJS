//http://blog.teamtreehouse.com/getting-started-speech-synthesis-api
//http://codepen.io/matt-west/pen/wGzuJ
//https://github.com/unk1911/speech/blob/master/js/speech.js

// Title: Text2Speech for Laserfiche WebLink 9.x
// About: Uses browser supported Speech Synthesis API to convert text found in Laserfiche WebLink documents to speech.
// Version: 1.0 (American date format)
// Date: 07/05/2016 (mm/dd/yyyy)
// Author: Wes Funderberg
// Compatibility: Laserfiche WebLink 9.x
// Speech Synthesis API: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
// Browser Support: http://caniuse.com/#feat=speech-synthesis
// Note: Permission given to use this script in Laserfiche WebLink 9.x if header lines are left unchanged.
// Install: Place disqus.js file in the Laserfiche WebLink script folder. Open up
//          the DocView.aspx file in an editor and add the following code before the </body> element:
//
//          <script type="text/javascript" src="<%= Page.ResolveUrl("~/script/text_to_speech.js")%>"></script>
//
//          Save DocView.aspx and refresh the page

var speech_dialog_id = 'SpeechDialog';
var speech_dialog_width = 640;
var speech_dialog_height = 430;
var speech_dialog_title = 'Speech Settings';
var pause_resume = false;
var DEFAULT_CHUNK_SIZE = 125;
var US_CHUNK_SIZE = 1024;

$(document).ready(function () {
    initSpeech();
});

function initSpeech() {
    var msg = new SpeechSynthesisUtterance('');
    window.speechSynthesis.cancel(); // Cancel previous
    if ('speechSynthesis' in window) {
        //Create the HTML for the Comments Dialog Box and inject it before the Laserfiche FOG div
        $(speech_dialog(speech_dialog_width, speech_dialog_height, speech_dialog_title, speech_dialog_id)).insertBefore('#fog');
        doInitVoices();
        var html = '<a href="javascript:void(0);" class="PageToolbarLink" id="TextToSpeech" rel="nofollow" title="Text To Speech">\
<div class="ToolbarIconWrapper"><div class="DocumentRightPanelToolbarIcon" id="PrintTextButton" title="Text To Speech" /></div><span>TXT2SPCH</span></a>';
        $(html).insertBefore('#SendEmailLink');
        $('#TextToSpeech').click(function () { speech_dialog_open(); });

        $("#pause_resume").click(function () {
            doPauseResume();
            return false;
        });

        $("#stop").click(function () {
            doStop();
            return false;
        });

        $("#speak").click(function () {
            doTTS();
            return false;
        });
    }
}

function doTTS() {

    var t = $('#speech-msg').val().replace(/\n/g, '');;
    var chunkList = getChunks(t);
    chunkList.forEach(function (chunk) {
        doSpeak(chunk);
    });

}

function text_to_speech() {

    var a = '';
    var current_page = DocViewer._displayPage;
	console.log(current_page);
    if (current_page === undefined)
        current_page = 0;
    $('.TextLayer div pre').each(function (i) {
		console.log(i);
        if (i === current_page) {
            var b = ($(this).text());
            var c = b.indexOf('This page contains no text.') > -1;
            if (!c)
                a = ($(this).text());
        }
    });
    $('#speech-msg').val(a);
}

/**
 * Uses jQuery constructor function to center Speech Dialog Box
 * Calls Laserfiche showFog() function to display overlay background
 * Used by <a href> on Page Toolbar in DocView.
 * @return null
 */
function speech_dialog_open() {
    if (DocViewer._config.showText) {
        $('#' + speech_dialog_id).center();
        showFog();
        text_to_speech();
    } else {
        alert("Please swith to \"Plain Text View\" before using this function.");
    }

    return false;
}

/**
 * Hides Speech Dialog Box from user.
 * Calls Laserfiche hideFog() function to hide overlay background
 * @return null
 */

function speech_dialog_close() {
    doStop();
    $('#' + speech_dialog_id).css('display', 'none');
    hideFog();
    return false;
}

/**
 * Constructs HTML for Speech Dialog Box
 * @param {Number} width : Width of Speech Dialog Box in pixels 
 * @param {Number} height : Heigh of Speech Dialog Box in pixels
 * @param {String} title : Display title of Speech Dialog Box
 * @param {String} id_dialog : Unique name of Speech Dialog Box
 * @return {String} html code
 */
function speech_dialog(width, height, title, id_dialog) {
    return '<div class="PopupDialogBorder" id="' + id_dialog + '" style="display:none;">\
<div class="PopupDialogTitle"><span>' + title + '</span></div>\
<div><div id="speech_controls" style="width:' + width + 'px; height:' + height + 'px; overflow-y: auto !important; max-height: ' + width + 'px;">\
<div><textarea name="speech-msg" id="speech-msg" style="width:100%;padding:0.5em;height:250px;" x-webkit-speech></textarea></div><div><label for="voice" style="display:inline-block;width:100px;">Voice</label><select name="voice" id="voice">\
</select></div><div><label for="volume" style="display:inline-block;width:100px;">Volume</label><input type="range" min="0" max="1" step="0.1" name="volume" id="volume" value="1"></div>\
<div><label for="rate" style="display:inline-block;width:100px;">Rate</label><input type="range" min="0.1" max="10" step="0.1" name="rate" id="rate" value="1"></div>\
<div><label for="pitch" style="display:inline-block;width:100px;">Pitch</label><input type="range" min="0" max="2" step="0.1" name="pitch" id="pitch" value="1" style="width:300px;"></div>\
<div><button id="speak" class="btn" type="button">Speak</button><button id="pause_resume" class="btn" type="button">Pause/Resume</button>\
<button id="stop" class="btn" type="button">Stop</button></div>\
</div>\
</div>\
<div class="ButtonDiv"><input type="button" class="btn btn-neutral" role="button" id="SpeechDialog_cancel" value="Close" name="SpeechDialog:cancel" onclick="javascript:speech_dialog_close();"></div>\
</div></div>';
}

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

function doInitVoices() {

    var msg = new SpeechSynthesisUtterance();
    var voiceSelect = $("#voice");
    var voices = window.speechSynthesis.getVoices();
    voices.forEach(function (voice, i) {
        var voiceName = voice.name;
        var selected = '';
        if (voiceName == 'native') {
            selected = 'selected';
        }
        var option = "<option value='" + voiceName + "' " + selected + " >" + voiceName + "</option>";
        voiceSelect.append(option);
    });
}
function doSpeak(s) {
    var voiceSelect = $("#voice");
    var selectedVoice = null;
    if (voiceSelect) {
        selectedVoice = voiceSelect.val();
    }

    var msg = new SpeechSynthesisUtterance();

    // If the user had selected a voice, use it...
    if (selectedVoice) {
        msg.voice = window.speechSynthesis.getVoices().filter(function (voice) {
            return voice.name == selectedVoice;
        })[0];
    }

    var rate = parseInt($("#rate").val());
    msg.rate = rate; // 0.1 to 10

    var pitch = parseInt($("#pitch").val());
    msg.pitch = pitch; // 0 to 2
    msg.text = s;

    // Now speak...
    window.speechSynthesis.speak(msg);
}
function doPauseResume() {
    if (!pause_resume) {
        window.speechSynthesis.pause();
        pause_resume = true;
    } else if (pause_resume) {
        window.speechSynthesis.resume();
        pause_resume = false;
    } else {
        console.log("Unknown state...");
    }
}

function doStop() {
    pause_resume = false;
    window.speechSynthesis.cancel();
}
function parsePhase0(s) {
    var out = "";
    s = s.replace(/\u00AD/g, '-');

    // Convert currency like "$1,000" to "$1000"
    for (var i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        if (ch == ',' && i > 0 && (i + 1) < s.length) {
            // If we are "surrounded" by numbers, simply remove the commas....
            var prevChar = s.charAt(i - 1);
            var nextChar = s.charAt(i + 1);
            if (isNumeric(prevChar) && isNumeric(nextChar)) {
                // "Swallow" the comma....
            } else {
                out += ch;
            }
        } else if (false) {
        } else {
            out += ch;
        }
    }
    return out;
}

function parsePhase1(s) {
    var out = "";

    // Take out URLs
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    out = s.replace(urlRegex, "{LINK}");

    return out;
}

function getChunkSize() {
    var cs = DEFAULT_CHUNK_SIZE;
    var voiceSelect = $("#voice");
    var selectedVoice = null;
    if (voiceSelect) {
        selectedVoice = voiceSelect.val();
        if (selectedVoice == 'native') {
            cs = US_CHUNK_SIZE;
        }
    }
    return cs;
}

function getChunks(s) {
    // First pass, convert/handle commas around currency, and various special characters
    s = parsePhase0(s);

    // Second pass, take out URLs, etc
    s = parsePhase1(s);

    // Chunk up the data
    var chunkList = [];
    chunkList = chunker(s, getChunkSize());
    return chunkList;
}

function chunker(s, max) {
    var chunks = [];
    var l = [];
    //l = s.split(/\.\s+|\n|,/);  // Split on: (period, comma, carriage-return)
    l = s.split(/\n/);  // Split on <CR>
    for (var i = 0; i < l.length; i++) {
        var chunk = l[i];
        if (chunk == '') {
            continue;
        }
        var siz = chunk.length;
        if (siz <= max) {
            chunks.push(chunk);
        } else {
            while (chunk.length > 0) {
                var smallerChunk = subChunker(chunk, max);
                chunks.push(smallerChunk);
                chunk = chunk.substr(smallerChunk.length);
            }
        }
    }
    return chunks;
}

function subChunker(s, max) {
    var chunk = s.substr(0, max);

    if (chunk.charAt(max) == ' ') {  // Lucky...
        return chunk;
    }

    // Start 'rewinding' until a space is found{hopefully}
    for (var i = chunk.length; i > 0; i--) {
        if (chunk.charAt(i) == ' ') {	// Stop!
            return chunk.substr(0, i);
        }
    }

    // No space found-- last resort have to cut in mid-word
    return chunk;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
