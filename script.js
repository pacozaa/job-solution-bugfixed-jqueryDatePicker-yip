var fields;
$(function () {
    var status = true;
    $("#toggle").click(function () {
        $('#menu_collapse').collapse('toggle');
        if(status == true) {
            //document.getElementById("bodyright").style.width= "1024px";
            setTimeout(function() {
                document.getElementById("bodyright").style.minHeight = "100%";
                document.getElementById("bodyright").style.minWidth = "100%";
                $("#masterGrid").setGridWidth($("#form_body").width() - 20);
            }, 330);
            
            status = false;
        } else {
            //document.getElementById("bodyright").style.width= "704px";
            document.getElementById("bodyright").style.minHeight = "0";
            document.getElementById("bodyright").style.minWidth = "0";
            setTimeout(function() {
                $("#masterGrid").setGridWidth($("#form_body").width() - 20);
            }, 330);
            status = true;
        }
            //document.getElementById("bodyright").style.width="1300px"; //$(window).width(); 
    });
    $('#menu_collapse').collapse( {
        toggle : true
    });
    $("#demo1").navgoco( {
        caret : '<span class="caret"></span>', accordion : false, openClass : 'open', save : true, cookie :  {
            name : 'navgoco', expires : false, path : '/'
        },
        slide :  {
            duration : 400, easing : 'swing'
        }
    });
    $("#collapseAll").click(function (e) {
        e.preventDefault();
        $("#demo1").navgoco('toggle', false);
    });
    $("#expandAll").click(function (e) {
        e.preventDefault();
        $("#demo1").navgoco('toggle', true);
        // Show|Hide sub-menus with specific indexes
        // It will also open parent sub-menus since v0.1.2			
        //$("#demo1").navgoco('toggle', true, 1, 2, 4);
    });
    
    
  
   
   //$("body").attr("onload", "firstLoad();afterLoad();");
   if ($("body").attr("onload") != undefined && $("body").attr("onload").indexOf('firstLoad') != -1) 
   {
      $("body").attr("onload", "firstLoad();afterLoad();");
   }
   // onblur decimal
   jQuery.fn.decimal = function(number, decimals) {
      var vnDecimal = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      var vnMaxLength = number + (Math.ceil((number - vnDecimal)/3));
      if (vnDecimal == 0)
      {
         vnMaxLength = vnMaxLength - 1;
      }


      var vaDecimal = '';
      while (vaDecimal.length < vnDecimal) {
         vaDecimal += '0';
      }
      return this.each(function() {
         $(this).attr("maxlength", vnMaxLength);
         $(this).on("blur", function() {
            var elementId = this.id;
            if (vaDecimal.length > 0)
            {
               $(this).val(cnvToFormat($(this).val(), "#,##0."+vaDecimal));
            }
            else
            {
               $(this).val(cnvToFormat($(this).val(), "#,##0"));
            }
            if ($(this).val().length > vnMaxLength)
            {
               if ($('#modalTmp').length == 0)
               {
                  $('<div class="modal fade" id="modalTmp">' +
                        '<div class="modal-dialog modal-sm">' +
                        '<div class="modal-content">' +
                           '<div class="modal-header">' +
                              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;<\/button>' +
                              '<h5 class="modal-title">&nbsp;<\/h5>' +
                           '<\/div>' +
                           '<div class="modal-body" style="text-align: center;">มีค่าเกินกว่ากำหนด<\/div>' +
                           '<div class="modal-footer" style="text-align: right;">' +
                           '<button type="button" class="btn btn-primary btn-xs" data-dismiss="modal" id="btnModalTmp"><b>&nbsp;&nbsp;ตกลง&nbsp;&nbsp;<\/b>' +
                           '<\/div>' +
                        '<\/div><\/div><\/div>').appendTo("body");
               }
               $("#modalTmp").off('shown.bs.modal');
               $("#modalTmp").on('shown.bs.modal', function() {
                  $("#btnModalTmp").focus();
               })
               $("#btnModalTmp").off("keydown.tab");
               $("#btnModalTmp").on("keydown.tab", function(e) {
                  if (e.keyCode == 9)
                  {
                     e.preventDefault();
                  }
               });
               $("#modalTmp").off("hide.bs.modal");
               $("#modalTmp").on("hide.bs.modal", function() {
               //alert(elementId);
               
                  $("#"+elementId).focus();
               });
               $(this).val("");
               $('#modalTmp').modal('show');
            }
         });
         
      });
   }
   // onblur decimal
   
   
   $("#OPNSRH").on("click", function() {
      afterLoad();
   });
   
   
});


function afterLoad()
{
   setDatePicker();//Function นี้ใช้สำหรับ กำหนดค่าเริ่มต้นทั้งหมดของ Jquery DatePicker  ที่กำหนดไว้ก่อนเรียก afterLoad() เนื่องจาก afterLoad()ก็มีความเกี่ยวข้องด้วย
	fields = $("form[name!=frmMenu] :input:visible:not([readonly]):enabled");
   fields.each(function(i) {
      
      $(this).off("keyup.tab");
      $(this).off("keydown.tab");
      $(this).on("keyup.tab", function(e) {
         if ($(this).val().length >= $(this).attr('maxlength') && (e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)) {
            
            var index = fields.index(this);
            
            $('.datepicker').remove();
            if ( index > -1 && ( index + 1 ) < fields.length && setValidateOnFocusOut()) {//กำหนดเงื่อนไข setValidateOnFocusOut เพิ่มเพื่อValidate วันที่ ถ้าไม่ถูกต้องจะลบค่าและ return ค่า false
               fields.eq(index+1).focus();
            }
            
         }         
      });
      
      $(this).on("keydown.tab", function(e) {
         if (e.keyCode == 9 && e.shiftKey == true) 
         {
            var index = fields.index(this);
            $('.datepicker').remove();
            if (index == 0 )
            {
               e.preventDefault();
               fields[fields.length-1].focus();
            }
         }
         else if (e.keyCode == 9 && e.shiftKey == false) 
         {
            var index = fields.index(this);
            $('.datepicker').remove();
            if (index == fields.length-1)
            {
               e.preventDefault();
               fields[0].focus();
            }
         }
         
      });
   });   
   $(":input[readonly]").attr("tabindex", "-1");
   
   //$.when(firstLoad()).then(afterLoad());
}
function logout()
{
   alert('logout');
}

