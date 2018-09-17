const DEFAULT_ROW = 10;
const DEFAULT_COLUMLN = 10;
var ColumnName = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

(function($) {
    $.fn.SpreadSheet = function(option) {
        var rowNum = DEFAULT_ROW;
        var colNum = DEFAULT_COLUMLN;
        if (option != undefined) {
            if (option.row != undefined) {
                rowNum = option.row;
            }
            if (option.column != undefined) {
                colNum = option.column;
            }
        }
    
        if ($(this).prop('tagName').toLowerCase() == 'body') { retur; }
    
        var $target = $(this);
    
        // create column header
        var $colHeader = $(document.createElement('tr'));
        var $colHeaderCell = $(document.createElement('th')).addClass('col');
        // add blank column for row header
        // ※blank column cannot resize!!
        var $colRowHeader = $colHeaderCell.clone();
        $colHeader.append($colRowHeader);

        // create row
        var $rows = $(document.createElement('tr')).addClass('row');
        // row header
        var $rowHeader = $(document.createElement('th')).addClass('row-header');
        $rows.append($rowHeader);

        // cell
        var $rowCell = $(document.createElement('td')).addClass('cell');
        var $cellCover = $(document.createElement('div')).addClass('cell-cover');
        $cellCover.dblclick(function(e) {
            $(this).hide();
            var $nextEl = $(this).next();
            $nextEl.css('font-family', $(this).css('font-family'));
            $nextEl.css('font-size', $(this).css('font-size'));
            $nextEl.focus();
        });
    
        var $cellText = $(document.createElement('textarea')).addClass('cell-text');
        $cellText.blur(function(e) {
            var text = this.value;
            if (!containsMultibytesChars(text)) {
                $(this).prev().css('padding-top', '1px');
            } else {
                $(this).prev().css('padding-top', '0');
            }
            $(this).prev().text(this.value);
            $(this).prev().show();
        });
    
        // add cell for row
        $rowCell.append($cellCover).append($cellText);
        for (var i = 0; i < colNum; i++) {
            // add cell
            var $clone = $rowCell.clone(true);
            $clone.attr('data-spreadsheet-colnum', i + 1);
            $rows.append($clone);
        }
    
        // create table
        var $sheetTbl = $(document.createElement('table')).addClass('spreadsheet');
        var $tHeader = $(document.createElement('thead'));
        var $tBody = $(document.createElement('tbody'));
        
        // add header column
        $tHeader.append($colHeader);
    
        // define resizeble opts for row header
        var rowResizableOpts = {
            minHeight: '1px',
            handles: 's',
            resize: function(event, ui) {
                // sbstraction cover div height size cause div hide table borders
                /*
                var $cellCover = $(this).parent().find('div.cell-cover');
                var height = parseInt($cellCover.css('height').replace('px', '')) - 1;
                $cellCover.css('height', height + 'px');
                */
                var $cellText = $(this).parent().find('textarea.cell-text');
                var height = parseInt($cellText.css('height').replace('px', '')) - 4;
                $cellText.css('height', height + 'px');
            }
        };
    
        // add rows
        for (var i = 0; i < rowNum; i++) {
            var $clone = $rows.clone(true);
            var alsoResize = {alsoResize: $clone.find('div.cell-cover,textarea.cell-text')}
            $.extend(rowResizableOpts, alsoResize);
            $clone.find('th.row-header').text(i + 1)
                .resizable(rowResizableOpts)
                .attr('data-spreadsheet-rownum', i + 1);
            $clone.find('td.cell').attr('data-spreadsheet-rownum', i + 1);
            $tBody.append($clone);
        }

        // append header and body before create column
        // cause wanna find rows in resizable
        $sheetTbl.append($tHeader).append($tBody);

        // define resizable options for column header
        var colResizeOpts = {
            minHeight: '15px',
            maxHeight: '15px',
            minWidth: '1px',
            handles: 'e',
            resize: function(event, ui) {
                // addition textarea height size cause be smaller than td height
                var colnum = $(this).closest('th').index();
                var $cellText = $(this).closest('.spreadsheet')
                    .find('[data-spreadsheet-colnum="' + colnum + '"] textarea.cell-text');
                var height = parseInt($cellText.css('height').replace('px', '')) - 3;
                $cellText.css('height', height + 'px');
                $cellText.find(':last-child').css('height', (height - 1) + 'px')
            }
        };
        // add column
        for (var i = 0; i < colNum; i++) {
            var $clone = $colHeaderCell.clone(true);
            $colHeader.append($clone);
            // set resizable after append cause wanna find parent elements
            var alsoResize = {alsoResize: $clone.closest('.spreadsheet')
                                .find('td[data-spreadsheet-colnum="' + (i + 1) + '"]')
                                .find('div.cell-cover,textarea.cell-text')}
            $.extend(colResizeOpts, alsoResize);
            $clone.text(ColumnName[i])
                .resizable(colResizeOpts);
        }
    
        $target.append($sheetTbl);
    };

    var containsMultibytesChars = function(text) {
        var actualLength = 0;
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            actualLength += encodeURI(char).split(/%..|./).length - 1;
        }
        return text.length != actualLength;
    }

})(jQuery);

/*
$(function() {
    // add functions
    $('.col').resizable({
        alsoResize: '.cell-text',
        minHeight: '15px',
        maxHeight: '15px',
        minWidth: '1px',
        handles: 'e'
    });

    $('.cell-cover')
        .dblclick(function(e) {
            $(this).hide();
            var $nextEl = $(this).next();
            $nextEl.css('font-family', $(this).css('font-family'));
            $nextEl.css('font-size', $(this).css('font-size'));
            $nextEl.focus();
        })
    ;

    $('.cell-text')
        .blur(function(e) {
            $(this).prev().text(this.value);
            $(this).prev().show();
        })
    ;
});
*/