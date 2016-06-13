var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
function htmlEncode(value) {
    return value.
        replace(/&/g, '&amp;').
        replace(SURROGATE_PAIR_REGEXP, function(value) {
            var hi = value.charCodeAt(0);
            var low = value.charCodeAt(1);
            return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
        }).
        replace(NON_ALPHANUMERIC_REGEXP, function(value) {
            return '&#' + value.charCodeAt(0) + ';';
        }).
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;');
}
function getJsonFromUrlParams(paramsRaw) {
    var result = {};
    paramsRaw.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}
var downloadPoc = function(parameters, uri, method, encodingType){
    var parsed = getJsonFromUrlParams(parameters)
    var inputs = "<table>";
    for(key in parsed){
        inputs += "<tr><td>" + key + "</td><td><input type=\"text\" value=\"" + parsed[key] + "\"" + " name=\"" + encodeURIComponent(key) + "\"></td></tr>\r\n";
    }
    inputs += "</table>";
    var poc = "<html><form enctype=\"" + encodingType + "\" method=\"" + method + "\" action=\"" + uri + "\">" + inputs + "<input type=\"submit\" value=\"" + uri + "\">" + "</form></html>";
    var blob = new Blob([poc], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "csrfPoc.html");
}
var startDownload = function(){
    var parameters = document.getElementById("body").value;
    var uri = document.getElementById("URI").value;
    var method = document.getElementById("method").value;
    var encoding = document.getElementById("encoding").value;
    downloadPoc(parameters, uri, method, encoding);
}
