"use strict";
/*	TO-DO: need to add marginLeft and marginRight;
    TO-DO: last line couldn't get the line-height unless add <br> before the close tag.
    For example: in believe
            var content = '<h5>'+panel.title+'<br></h5>';
            var textCanvas = new CanvasTextConverter.render(content+'<br>', {width:product_width}, globalCSS);
    TO-DO: html's content has to be single quoted, otherwise the class name can't be used.
    For example, in believe world_data.js,
    {
        id:xxx,
        html:"<p class='abc'>xxxx</p>"
    }
    doesn't work.
    Has to be:
    {
        id:xxx,
        html:'<p class="abc">xxxx</p>'
    }
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasTextRenderer = CanvasTextRenderer;
let globalCSS = {};
function isNumeric(n) {
    return !isNaN(parseFloat(n));
}
function extend(tf, e1, e2, e3) {
    if (typeof tf == 'boolean') {
        return Object.assign(e1, e2, e3 || {});
    }
    return Object.assign(e1, e2 || {}, e3 || {});
}
function CanvasTextRenderer() {
    //renderCanvasText(this,globalCSS);
    var self = this;
    var text = self.html;
    //store the readable data in the canvas element html object
    if (text !== null && text !== '') {
        if (self.bitmapData === false) {
            self.bitmapData = document.createElement('canvas');
            self.bitmapDataContext = self.bitmapData.getContext('2d');
            self.bitmapData.width = 10;
            self.bitmapData.height = 10;
        }
        //generate the canvas via CanvasTextConverter
        var newCanvas = CanvasTextConverter.render(text + '<br>', { width: self.width }, globalCSS);
        //function to ensure val is 0 or positive number
        function setSafeCanvasDimension(val) {
            if (isNumeric(val) && val > 0) {
                if (val < 1) {
                    return 1;
                }
                else {
                    return Math.floor(val);
                }
            }
            else {
                return 0;
            }
        }
        var dimensions = {
            width: setSafeCanvasDimension(newCanvas.width),
            height: setSafeCanvasDimension(newCanvas.height),
        };
        self.bitmapData.width = dimensions.width;
        self.bitmapData.height = dimensions.height;
        self.width = dimensions.width;
        self.height = dimensions.height;
        if (dimensions.width > 0 && dimensions.height > 0) {
            self.bitmapDataContext.drawImage(newCanvas, 0, 0, dimensions.width, dimensions.height);
        }
    }
}
// CanvasTextConverter
var CanvasTextConverter = (function (config) {
    var SPACE_CHAR = '_-_-_-_-_-';
    //maxm
    //var for dynamic height of canvas
    var totalHeight;
    function render(text, config, styleSheet) {
        totalHeight = 0;
        var cvs = document.createElement('canvas');
        var scale = config && isNumeric(config.scale) ? config.scale : 1;
        cvs.width = (config && isNumeric(config.width) ? config.width : 500) * scale;
        var d = htmlToTextData('<html>' + text + '</html>');
        var styles = extend(true, DEFAULT_STYLES, styleSheet || {});
        //set canvas height dynamically
        cvs.height = textDataToCanvas(d, styles, cvs, scale, true);
        textDataToCanvas(d, styles, cvs, scale, false);
        return cvs;
    }
    function addStyles(s) {
        extend(true, DEFAULT_STYLES, s);
    }
    // supported inline styles
    var inlineStyleKeys = {
        'font-size': 'fontSize',
        'font-face': 'fontFace',
        'font-weight': 'fontWeight',
        'font-style': 'fontStyle',
        color: 'color',
        'line-height': 'lineHeight',
        width: 'width',
        'margin-top': 'marginTop',
        'margin-left': 'marginLeft',
        'margin-right': 'marginRight',
        'margin-bottom': 'marginBottom',
        'text-align': 'textAlign',
        'text-decoration': 'textDecoration',
        display: 'display',
    };
    function parseInlineStyles(str) {
        var inlineStyles = {};
        if (str) {
            var sty = str.split(';');
            for (var i = 0; i < sty.length; i++) {
                if (sty[i].indexOf(':') > -1) {
                    sty[i] = sty[i].split(':');
                    if (inlineStyleKeys[sty[i][0]]) {
                        switch (inlineStyleKeys[sty[i][0]]) {
                            case 'fontSize':
                            case 'marginTop':
                            case 'marginLeft':
                            case 'marginRight':
                            case 'marginBottom':
                            case 'lineHeight':
                                // need to strip px/em
                                sty[i][1] = parseInt(sty[i][1], 10);
                                break;
                        }
                        inlineStyles[inlineStyleKeys[sty[i][0]]] = sty[i][1];
                    }
                }
            }
        }
        return inlineStyles;
    }
    function htmlToTextData(str) {
        result = str
            .replace(/(\S{1}<)/g, function (a) {
            return a.slice(0, 1) + ' <';
        })
            .replace(/(>\S{1})/g, function (a) {
            return '> ' + a.slice(-1);
        })
            .replace(/(<.*?>)/g, function (a) {
            return a.replace(' ', SPACE_CHAR);
        })
            .split(/\s/g);
        for (var i = 0; i < result.length; i++) {
            if (result[i].match(/<br>/)) {
                result[i] = { type: 'html_break', html: true };
            }
            else if (result[i].match(/<\w+.*?>/)) {
                var s = result[i].replace(SPACE_CHAR, ' ');
                var tag = s.match(/<(\w{1,}\d{0,})\b/)[1];
                var cls = s.match(/class="(.*?)"/);
                var sty = s.match(/style="(.*?)"/);
                var inlineStyles = {};
                if (sty) {
                    inlineStyles = parseInlineStyles(sty[1]);
                }
                result[i] = { type: 'html_open', html: true, text: s, tag: tag, inlineStyles: inlineStyles, cls: cls ? cls[1] : cls };
            }
            else if (result[i].match(/<\/\w+.*?>/)) {
                var s = result[i].replace(SPACE_CHAR, ' ');
                var tag = s.match(/<\/(\w{1,}\d{0,})\b/)[1];
                result[i] = { type: 'html_close', html: true, text: s, tag: tag };
            }
            else {
                result[i] = { type: 'word', text: result[i] };
            }
        }
        // quirky solution to the space that is added between a word and punctuation when a html tag is in between
        for (var i = 0; i < result.length - 2; i++) {
            if (result[i].t == 'word' && result[i + 1].html && result[i + 2].t == 'word' && result[i + 2].s.length == 1 && '!.:;?'.indexOf(result[i + 2].s) != -1) {
                result[i].s = result[i].s + result[i + 2].s;
                result.splice(i + 2, 1);
            }
        }
        return result;
    }
    function textDataToCanvas(blocks, styles, cvs, scale, getDynamicHeight) {
        var applyStyle = function (s) {
            ctx.fillStyle = s.color;
            ctx.font = s.fontStyle + ' ' + s.fontWeight + ' ' + s.fontSize * scale + 'px ' + s.fontFace;
            SPACE_WIDTH = ctx.measureText(' ').width;
        };
        var getStyle = function (styleName) {
            return styles[styleName] || {};
        };
        var mergeStyles = function (styleHistoryObj, predefinedStyleObj, classRulesObj, inlineRulesObj) {
            var o = {};
            extend(o, styleHistoryObj, predefinedStyleObj, classRulesObj, inlineRulesObj);
            // calculate lineHeight when not specified
            o._lineHeight = o.lineHeight == -1 ? o.fontSize * 1.15 : o.lineHeight;
            return o;
        };
        //var ctx = cvs.getContext('2d');
        var styleHistory = [extend({}, styles.html)];
        var ctx = cvs.getContext('2d', { alpha: styleHistory[0].backgroundColor == 'none' || styleHistory[0].backgroundColor == 'transparent' ? true : false });
        if (styleHistory[0].backgroundColor != 'none' && styleHistory[0].backgroundColor != 'transparent') {
            ctx.fillStyle = styleHistory[0].backgroundColor;
            ctx.fillRect(0, 0, cvs.width, cvs.height);
        }
        var SPACE_WIDTH = 0;
        var scale = scale || 1;
        var boxWidth = cvs.width;
        var LH0 = 0.85; // space above baseline
        var LH1 = 0.15; // space below baseline
        var x = 0;
        var y = 100;
        var w = 0;
        var lines = [];
        var currentLine;
        var currentBlock = false;
        var textWidth = 0;
        function newLine() {
            currentLine = { lineHeight: styleHistory[0]._lineHeight, width: 0, blocks: [] };
            lines.push(currentLine);
            currentBlock = false;
            //maxm
            //add height of each new line to the total height
            if (isNumeric(currentLine.lineHeight))
                totalHeight += currentLine.lineHeight;
        }
        function newBlock(config) {
            var found = currentLine.blocks.filter((n) => n.type == 'text');
            currentBlock = extend({ width: 0, firstTextBlock: config.type == 'text' && found.length == 0 }, config);
            currentLine.blocks.push(currentBlock);
        }
        newLine();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            switch (block.type) {
                case 'word':
                    textWidth = ctx.measureText(block.text).width;
                    if (currentLine.width + SPACE_WIDTH + textWidth > boxWidth) {
                        newLine();
                    }
                    if (currentBlock.type !== 'text') {
                        newBlock({ type: 'text', text: [block.text], width: textWidth });
                    }
                    else {
                        currentBlock.text.push(block.text);
                        currentBlock.width += SPACE_WIDTH + textWidth;
                    }
                    currentLine.width += SPACE_WIDTH + textWidth;
                    break;
                case 'html_open':
                    styleHistory.unshift(mergeStyles(styleHistory[0], getStyle(block.tag), getStyle(block.cls), block.inlineStyles));
                    applyStyle(styleHistory[0]);
                    if (currentBlock.type == 'style') {
                        currentBlock.style = extend({}, styleHistory[0]);
                    }
                    else {
                        newBlock({ type: 'style', style: extend({}, styleHistory[0]) });
                    }
                    // if(currentLine.lineHeight==null){
                    // 	currentLine.lineHeight = styleHistory[0]._lineHeight;
                    // } else {
                    // 	currentLine.lineHeight = Math.max(currentLine.lineHeight,styleHistory[0]._lineHeight);
                    // }
                    currentLine.lineHeight = styleHistory[0]._lineHeight;
                    break;
                case 'html_close':
                    if (styleHistory[0].display == 'block') {
                        newLine();
                    }
                    styleHistory.shift();
                    applyStyle(styleHistory[0]);
                    if (currentBlock.type == 'style') {
                        currentBlock.style = extend({}, styleHistory[0]);
                    }
                    else {
                        newBlock({ type: 'style', style: extend({}, styleHistory[0]) });
                    }
                    // currentLine.lineHeight = Math.max(currentLine.lineHeight,styleHistory[0]._lineHeight);
                    currentLine.lineHeight = styleHistory[0]._lineHeight;
                    break;
                case 'html_break':
                    newLine();
                    break;
            }
        }
        var firstLine = true;
        var currentStyle = lines[0].blocks[0].style;
        var _x = 0;
        var _y = 0;
        var _y2 = 0;
        //function to ensure value is an integer
        function returnInt(val) {
            newVal = parseInt(val);
            if (+newVal === newVal && !(newVal % 1)) {
                return newVal;
            }
            else {
                return 0;
            }
        }
        function calculateDynamicHeight(blockStyle) {
            //add margin and padding to total height
            totalHeight += returnInt(blockStyle.marginTop) + returnInt(blockStyle.marginBottom) + returnInt(blockStyle.paddingTop) + returnInt(blockStyle.paddingBottom);
        }
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            var startText = false;
            var textBlockCount = 0;
            //count the number of text blocks for handling inline blocks with margins
            for (var ix = 0; ix < l.blocks.length; ix++) {
                if (l.blocks[ix].type === 'text') {
                    textBlockCount++;
                }
            }
            for (var ii = 0; ii < l.blocks.length; ii++) {
                var b = l.blocks[ii];
                //if running func to get height
                //skip switch statement and drawing of canvas
                if (getDynamicHeight) {
                    if (b.type === 'style')
                        calculateDynamicHeight(b.style);
                }
                else {
                    switch (b.type) {
                        case 'style':
                            applyStyle(b.style);
                            currentStyle = b.style;
                            calculateDynamicHeight(b.style);
                            //if only one block of text on the line, but has display:inline, ignore display:inline
                            if (b.style.display !== 'inline' || textBlockCount < 2) {
                                _y += b.style.marginTop + _y2; //account for margin bottom of previous element
                                _y2 = b.style.marginBottom; //set new margin bottom for following element
                            }
                            else {
                                _y2 = b.style.marginBottom;
                            }
                            break;
                        case 'text':
                            if (!startText) {
                                _y += l.lineHeight * LH0;
                                if (currentStyle.textAlign == 'center') {
                                    _x = (boxWidth - l.width) * 0.5;
                                    // for testing highlight text rectangle
                                    ctx.save();
                                }
                                startText = true;
                            }
                            ctx.fillText(b.text.join(' '), _x, _y);
                            if (currentStyle.textDecoration == 'underline') {
                                var underscoreHeight = Math.max(1, (currentStyle.fontSize * scale) / 12);
                                ctx.fillRect(_x, _y + Math.max(1.5, Math.ceil(underscoreHeight * 0.5)), b.width, underscoreHeight);
                            }
                            _x += b.width;
                            break;
                    }
                }
            }
            _x = 0;
            _y += l.lineHeight * LH1;
        }
        //maxm
        return totalHeight;
    }
    var DEFAULT_STYLES = {
        html: {
            fontSize: 12,
            fontFace: 'Arial',
            fontWeight: 'normal',
            fontStyle: '',
            color: '#000',
            lineHeight: -1,
            width: 500,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            maxWidth: 500,
            textAlign: 'left',
            textDecoration: 'none',
            display: 'inline',
            backgroundColor: 'none',
        },
        defaultStyle: {
            fontSize: 12,
            fontFace: 'Arial',
            fontWeight: 'normal',
            fontStyle: '',
            color: '#000',
            lineHeight: -1,
            width: 500,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            maxWidth: 500,
            textAlign: 'left',
            textDecoration: 'none',
            display: 'inline',
        },
        b: {
            fontWeight: 'bold',
            display: 'inline',
        },
        strong: {
            fontWeight: 'bold',
            display: 'inline',
        },
        i: {
            fontStyle: 'italic',
            display: 'inline',
        },
        em: {
            fontStyle: 'italic',
            display: 'inline',
            marginBottom: 0,
            marginTop: 0,
        },
        u: {
            textDecoration: 'underline',
            display: 'inline',
        },
        h1: {
            display: 'block',
            fontWeight: 'bold',
        },
        h2: {
            display: 'block',
            fontWeight: 'bold',
        },
        h3: {
            display: 'block',
            fontWeight: 'bold',
        },
        p: {
            display: 'block',
        },
    };
    return {
        render: render,
        addStyles: addStyles,
    };
})();
