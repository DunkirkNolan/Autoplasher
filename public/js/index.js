var
$TABLE = $('#table1'),
$BTNEXP = $('#export-btn'),
$BTNTST = $('#test-btn'),
$BTNPREP = $('#excel2form-btn'),
$EXPORT = $('#export'),
$TABLENUM = 1,
$CELLNUM = 4,
request = new XMLHttpRequest();

show_table(1);
setTextareaTabFix();

$('.illPlus').click(function() {
  $CELLNUM = 4;
  set_table(1);
    request.open("GET", '/illPlus', true);
    request.send();
});

$('.rusIll').click(function() {
  $CELLNUM = 4;
  set_table(2);
    request.open("GET", '/rusIll', true);
    request.send();
});

$('.zooPark').click(function() {
  $CELLNUM = 4;
  set_table(3);
    request.open("GET", '/zooPark', true);
    request.send();
});

$('.euroKino').click(function() {
  $CELLNUM = 4;
  set_table(4);
    request.open("GET", '/euroKino', true);
    request.send();
});

$('.detskiy').click(function() {
  $CELLNUM = 4;
  set_table(5);
    request.open("GET", '/detskiy', true);
    request.send();
});

$('.detskiyTitles').click(function() {
  $CELLNUM = 2;
  set_table(6);
    request.open("GET", '/detskiyTitles', true);
    request.send();
});

$('.detskiyHD').click(function() {
  $CELLNUM = 4;
  set_table(8);
    request.open("GET", '/detskiyHD', true);
    request.send();
});

$('.auto24').click(function() {
  $CELLNUM = 3;
  set_table(7);
    request.open("GET", '/auto24', true);
    request.send();
});

    
//Resize Textarea to fit Content
$('.excel_input').on('change keyup keydown paste cut', 'textarea', function() {
  $(this).height(0).height(this.scrollHeight);

}).find('textarea').change();

$BTNPREP.click(function() {
  var data = $('textarea[name=excel_data]').val();
  var $clone;
  var rows = data.split("\n");

  for (var y in rows) {
    var cells = rows[y].split("\t");
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');

    if (cells.length > 1) {
      if (cells.length == $CELLNUM) {
        for (var x in cells) {
          $clone.find('td').eq(x).text(cells[x]);
        }

        $TABLE.find('table').append($clone);
      } else {
        alert("Неправильное количество ячеек в строке " + ((+1) + (+y)) + ", должно быть " + $CELLNUM + ", а у тебя " + cells.length);
      }
    }
  }

});

$('.table-add').click(function() {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
  $TABLE.find('table').append($clone);
});

$('.table-remove').click(function() {
  $(this).parents('tr').detach();
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
0.

jQuery.fn.shift = [].shift;

$BTNEXP.click(function() {
    //if(check4EmptyCells($TABLE))
        //alert('Сначала заполни таблицу!');
   // else sendTSVTable($TABLE);
    sendTSVTable($TABLE);
});

function show_table() {
  for (var i = 1; i < 9; i++) // change 7 to the amount of tables 
    if (document.getElementById('table' + i))
      document.getElementById('table' + i).style.display = 'none';

  for (var i = 0; i < arguments.length; i++)
    if (document.getElementById('table' + arguments[i]))
      document.getElementById('table' + arguments[i]).style.display = 'block';

}

function set_table(tablenum) {
  $TABLENUM = tablenum;
  $TABLE = $('#table' + tablenum);
  show_table(tablenum);
}

/*function check4EmptyCells($table2check) {
    var isEmpty = false;
    
    $(function(){
    $table2check.find('tr.hide').each(function(){

        $(this).find('td').each(function(){
            
       
            //alert($(this).text().trim() == '');
            //alert($(this).hasClass('notempty'));
            
            if(($(this).hasClass('notempty'))&&($(this).text().trim() == '')){
                isEmpty = true;
                }
            });
        });
    })

    return isEmpty;
}*/

function setTextareaTabFix() {
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i=0;i<count;i++){
        textareas[i].onkeydown = function(e){
            if(e.keyCode==9 || e.which==9){
                e.preventDefault();
                var s = this.selectionStart;
                this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                this.selectionEnd = s+1; 
            }
        }
    }
};


request.onreadystatechange = function() {
    if (request.readyState === 4) {
        if (request.status === 200) {
            document.body.className = 'ok';
        } else {
            document.body.className = 'error';
        }
    }
};

// Automatically styles the tooltip for all HTML elements with a TITLE attribute defined (this includes elements dynamically added //to the document in the future)
(function () {
    var ID = "tooltip", CLS_ON = "tooltip_ON", FOLLOW = true,
    DATA = "_tooltip", OFFSET_X = 20, OFFSET_Y = 10,
    showAt = function (e) {
        var ntop = e.pageY + OFFSET_Y, nleft = e.pageX + OFFSET_X;
        $("#" + ID).html($(e.target).data(DATA)).css({
            position: "absolute", top: ntop, left: nleft
        }).show();
    };
    $(document).on("mouseenter", "*[title]", function (e) {
        $(this).data(DATA, $(this).attr("title"));
        $(this).removeAttr("title").addClass(CLS_ON);
        $("<div id='" + ID + "' />").appendTo("body");
        showAt(e);
    });
    $(document).on("mouseleave", "." + CLS_ON, function (e) {
        $(this).attr("title", $(this).data(DATA)).removeClass(CLS_ON);
        $("#" + ID).remove();
    });
    if (FOLLOW) { $(document).on("mousemove", "." + CLS_ON, showAt); }
}());


function sendTSVTable(table2Send) {
    
    ws = new WebSocket("ws://cu-anons8:6606");
    $("#popup1").show();
    
    ws.onopen = function()
       {
          // Web Socket is connected, send data using send()
          //ws.send(table2Send.table2CSV({delivery:'value', header: [] }));
            ws.send(table2TSV(table2Send));
            $("#popup1").$(".b-popup-content").text("Таблица отправлена на сервер");
            alert($("#popup1").find("b-popup-content").text());
          //alert("Message is sent...");
       };
    ws.onclose = function()
    {
        // websocket is closed.
        //alert("Connection is closed..."); 
        $("#popup1.b-popup-content").text("Соединение закрыто");
        ws.close();
    }
    ws.onerror = function()
    {
        alert("Web Socket connnection error while sending TSV table");
        ws.close();
    }
    
    //ws.onmessage = function(event) {
      //   $("#popup1.b-popup-content").text(event.data);
    //}
}

function table2TSV($table) {

        var $rows = $table.filter(':visible').find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '\t',
            rowDelim = '\r\n',

            // Grab text from table into CSV formatted string
            tsv = $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');
                
                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    if(text.match(/\S/g))
                    return text;
                
                }).get().join(tmpColDelim);

                }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim);
                
        return tsv.substring(tsv.indexOf("\n") + 1);
}


// progress bar

var colorInc = 100 / 3;

$(function()
{
  $("#percent-box").click(function()
  {
    $(this).select();
  });
  
  $("#percent-box").keyup(function()
  {
    var val = $(this).val();
    
    if(val != ""
      && !isNaN(val)
      && val <= 100
      && val >= 0)
    {
      console.log(val);
      
      var valOrig = val;
      val = 100 - val;
      
      if(valOrig == 0)
      {
        $("#percent-box").val(0);
        $(".progress .percent").text(0 + "%");
      }
      else $(".progress .percent").text(valOrig + "%");
      
      $(".progress").parent().removeClass();
      $(".progress .water").css("top", val + "%");
      
      if(valOrig < colorInc * 1)
        $(".progress").parent().addClass("red");
      else if(valOrig < colorInc * 2)
        $(".progress").parent().addClass("orange");
      else
        $(".progress").parent().addClass("green");
    }
    else
    {
      $(".progress").parent().removeClass();
      $(".progress").parent().addClass("green");
      $(".progress .water").css("top", 100 - 67 + "%");
      $(".progress .percent").text(67 + "%");
      $("#percent-box").val("");
    }
  });
});

$(document).ready(function(){
    PopUpHide();
});
function PopUpShow(){
    $("#popup1").show();
}
function PopUpHide(){
    $("#popup1").hide();
}