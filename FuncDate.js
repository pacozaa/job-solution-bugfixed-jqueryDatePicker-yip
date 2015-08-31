// Description : Key 0123456789 Only and Auto "/" 
// Parameter : 1) objectID = string object id
//             2) dateType = string date format         
//                1 = mm/dd/yyyy
//                2 = yyyy/dd/mm  (Unable to do date check at this time)
//                3 = dd/mm/yyyy
//   example :
//   $("document").ready(function(){
//      setFormatDate("objectID","3");
//   }
var AlarmCaption = "กรุณาระบุ วัน เดือน ปี ให้ถูกต้อง";//กำหนด Caption สำหรับ alertModal เมื่อ ค่าวันที่ไม่ถูกต้อง
//กำหนดเงื่อนไข setValidateOnFocusOut เพิ่มเพื่อValidate วันที่ ถ้าไม่ถูกต้องจะลบค่าและ return ค่า false
function setValidateOnFocusOut()
{
//ใช้ .each เพื่อวนรับค่า vaSetDatePicker ทั้งหมดและกำหนดลงเงื่อนไข  ดูเพิ่มเติมใน google 'jquery .each'
    var dateValid = true;
      $.each( vaSetDatePicker, function( id, message ) {
        if (validateDate($("#"+id).val()) == false && $("#"+id).val() != '') //เรียก ValidateDate และ ValidateDate เรียก isDate อีกต่อ เพื่อตรวจสอบวันที่
        {
            alertFaultDate(id,message);//แสดง Modal
            $("#"+id).val("");
            dateValid =false;
        }  
      });
    return dateValid;//Return ค่า false เพื่อไม่ให้ afterLoad() ย้าย focus
}
function setDatePicker()
{
   $.each( vaSetDatePicker, function( id, message ) {
         setDatePicketDeleteSelected(id);//กำหนดให้ datepicker สามารถ replace ตัวเลขได้ เมื่อ shift-tab
         $('#myModal').on('hidden.bs.modal', function () {//event trigger เมื่อ modal ซ่อน ให้โฟกัส และลบ ค่า modal ทิ้ง
              if(id == $('#myModal').val())
              {
                 $('#'+$('#myModal').val()).focus();
                 $('#myModal').val('');
              }
         });
         //กำหนดค่าให้ datepicker ทั่วไป
         setFormatDate(id, 3);
          $('#'+id).datepicker({
              language: 'th-th',
              autoclose: true,
              orientation: "auto",
              format: "dd/mm/yyyy"
          });
          $('#'+id).change(function () {
            if($(this).val().length >= $(this).attr('maxlength'))
            {
               var e = $.Event('keyup.tab');//กำหนดค่าสำหรับเตรียม จำลองการกด
               $('#'+id).trigger(e);//ส่งการจำลองการกด keyup
            }
         });
      });
}

function alertFaultDate(id,massage)//Modal สำหรับเตือนเมื่อ วันที่ใน date picker validate ไม่ผ่าน
{
   $("#modalConfirm").html(massage);
    $("#modalButton").html("<button type=\"button\" class=\"btn btn-warning btn-xs\" data-dismiss=\"modal\"><b>&nbsp;&nbsp;แก้ไข&nbsp;&nbsp;<\/b><\/button>");
    $('#myModal').modal('show');
    $('#myModal').val(id);//กำหนดค่าให้ id val เพื่อเอาไปใช้ที่ setDatePicker
}
function showMessage(vaReload, vaType, vaErrMsg, vaFocus)
{
   var vaAlert = "alert-warning";
	if(vaType == "danger")
	{
		vaAlert = "alert-danger";
	}
	else if(vaType == "success")
	{
		vaAlert = "alert-success";
	}
	
	$("#"+vaReload).html("<div class='alert " + vaAlert +" alert-dismissable' style='text-align: center; margin-bottom: 5px;'>" + "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;<\/button><b>" + vaErrMsg +" <\/b><\/div>");
   $('html, body').animate({ scrollTop: 0 }, 0);
	
	//setFocus
	if(vaFocus.length > 0)
	{
		if($("#"+vaFocus).prop('tagName') == "SELECT" || $("#"+vaFocus).attr('class').indexOf("select") > -1){
			$("#"+vaFocus).select2("focus");
		}
		else{
			$("#"+vaFocus).focus();
		}
	}
}//showMessage
function setDatePicketDeleteSelected(objectID)//ตรวจสอบการ highlight และแทนค่า
{
        $("#"+objectID).keydown(function(e)
        {
           var vaKeyCode = e.which;// recommended to use e.which, it's normalized across browsers
           if(90 >= vaKeyCode &&vaKeyCode >= 48)//กรองการกด keyboard ต้องเป็นเลขหรือตัวอักษรเท่านั้น
           {
              if(isTextSelected($("#"+objectID)[0]))//เรียก function isTextSelected เพื่อตรวจสอบว่ามีการ highlight หรือไม่ถ้ามีให้ แทนค่า '' ลงไป
               {
                  $("#"+objectID).val('');
               } 
           }
           
        });    

      
}
function isDate(ExpiryDate) {
    var objDate, // date object initialized from the ExpiryDate string 
        mSeconds, // ExpiryDate in milliseconds 
        day, // day 
        month, // month 
        year; // year 
    // date length should be 10 characters (no more no less) 
    if (ExpiryDate.length !== 10) {
        return false;
    }
    // third and sixth character should be '/' 
    if (ExpiryDate.substring(2, 3) !== '/' || ExpiryDate.substring(5, 6) !== '/') {
        return false;
    }
    // extract month, day and year from the ExpiryDate (expected format is mm/dd/yyyy) 
    // subtraction will cast variables to integer implicitly (needed 
    // for !== comparing) 
    day = ExpiryDate.substring(0, 2) - 0;
    month = ExpiryDate.substring(3, 5) - 1; // because months in JS start from 0 //credit: Paco
    year = ExpiryDate.substring(6, 10) - 0;
    // test year range 
    if (year < 1000 || year > 3000) {
        return false;
    }
    // convert ExpiryDate to milliseconds 
    mSeconds = (new Date(year, month, day)).getTime();
    // initialize Date() object from calculated milliseconds 
    objDate = new Date();
    objDate.setTime(mSeconds);
    // compare input date and parts from Date() object 
    // if difference exists then date isn't valid 
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day) {
        return false;
    }
    // otherwise return true 
    return true;
}

function validateDate(valDate) {
    var ExpiryDate = valDate;
    // check date and print message 
    if (isDate(ExpiryDate)) {
        return true;
    } else {
        return false;
    }
}
function isTextSelected(input)
{
	if (typeof input.selectionStart == "number")
	{
		return input.selectionStart == 0 && input.selectionEnd == input.value.length;
	}
	else if (typeof document.selection != "undefined")
	{
		input.focus();
		return document.selection.createRange().text == input.value;
	}
}
function setFormatDate(objectID, dateType) {
    var vDateType = 3;

    if (dateType != undefined)
        vDateType = dateType;

    $("#" + objectID).on("keypress", function (event) {
        var key;
        var keychar;

        if (window.event) {
            key = event.keyCode;
        }
        else if (event) {
			if(event.ctrlKey){
                return true;
            }
            key = event.which;
        }
        else {
            return true;
        }

        keychar = String.fromCharCode(key);

        // control keys
        if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 27)) {
            return true;
        }
        // numbers 
        else if ((("0123456789").indexOf(keychar) >  - 1)) {

            if (vDateType == 3) {

                if ($("#" + objectID).val().length == 2 || $("#" + objectID).val().length == 5) {
                    $("#" + objectID).val($("#" + objectID).val() + "/");
                    return true;
                }
            }
            else if (vDateType == 2) {
                if ($("#" + objectID).val().length == 3 || $("#" + objectID).val().length == 6) {
                    $("#" + objectID).val($("#" + objectID).val() + "/");
                    return true;
                }
            }
            else if (vDateType == 1) {
                if ($("#" + objectID).val().length == 2 || $("#" + objectID).val().length == 5) {
                    $("#" + objectID).val($("#" + objectID).val() + "/");
                    return true;
                }
            }

            if ($("#" + objectID).val().length >= 10) {
                return false;
            }
        }
        else {
            return false;
        }

        return true;
    });

}

// Description : Calculate two date and return value date2 - date1
// Parameter : date1 = first date format dd/mm/yyyy
//             date2 = second date format dd/mm/yyyy
//			   typeEra = true : Buddish Era and false : Cristian Era				
function calDateDif(date1, date2, typeEra) {
    var datePat = /^(\d{2})\/(\d{2})(\/(\d{4}))?$/;
    var matchArray1 = null;
    var matchArray2 = null;
    if (typeEra == undefined) {
        typeEra = true;
    }

    if (date1 != '' && date1 != null && date2 != '' && date2 != null) {
        matchArray1 = date1.match(datePat);
        matchArray2 = date2.match(datePat);
        if (matchArray1 == null || matchArray2 == null) {
            alert("ไม่สามารถเปรียบเทียบค่าได้ เพราะ รูปแบบไม่ถูกต้อง");
        }
        else {
            day1 = matchArray1[1];
            month1 = matchArray1[2];
            year1 = matchArray1[4];

            day2 = matchArray2[1];
            month2 = matchArray2[2];
            year2 = matchArray2[4];

            if (typeEra) {
                year1 = year1 - 543;
                year2 = year2 - 543;
            }

            var one_day = 1000 * 60 * 60 * 24

            return ((Date.parse(eval(month2) + "/" + day2 + "/" + year2) - Date.parse(eval(month1) + "/" + day1 + "/" + year1))) / (one_day);
        }
    }
}