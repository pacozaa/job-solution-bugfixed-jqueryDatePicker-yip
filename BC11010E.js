var jqGridBC11010E = '';
//vaSetDatePicker เป็นตัวแประที่ต้องบรรจุด id ของ DatePicker ทั้งหมดในจอไว้ ในรูปแบบ Array ที่เป็น format key:value ดูเพิ่มเติมใน google 'jquery .each'
//id จะอยู่ในฝั่ง key ส่วน value ให้กำหนดเป็น AlarmCaption ทั้งหมด เช่น datePickerIdName : AlarmCaption
var vaSetDatePicker = {"requestDateStartSrh":AlarmCaption
                        , "requestDateStopSrh":AlarmCaption};

$(document).ready(function() {
    setFieldPattern("moo","0010000");
    setFormatTel("custTelephone",2);
    setFormatTel("custMobile",3);
    setDefaultValue();
    var actRtn = $("#act").val();
    if (actRtn == 'NEW' || actRtn == 'SRH' || actRtn == 'ADDRTN' || actRtn != 'INQRTN')
    {
        $("#barSearch").show();
        $("#gridSearch").show();
        $("#form1").hide();
        $("#form2").hide();
        $("#form3").hide();
        $("#form4").hide(); 
        $("#yearSrh").focus(); 
        createGrid();
    }
    else 
    {
        $("#barSearch").hide();
        $("#gridSearch").hide();
        $("#form1").show();
        $("#form2").show();
        $("#form3").show();
        $("#form4").show();
        
        if ($("#act").val() == 'ADDERR')
        {
              $("#custName").focus()
              $("#updatedBy").val("");
              $("#updatedDate").val("");
        }
    }
    setDDList();
    $("#CopyAbove").change(function() {
    if(this.checked) {
        $("#custName").val($("#custNameHid").val());
        $("#provinceCodeCtl option[value="+$("#provinceCodeHid").val()+"]").attr("selected", true);
        $("#amphurCode option[value="+$("#amphurCodeHid").val()+"]").attr("selected", true);
        $("#districtCode option[value="+$("#districtCodeHid").val()+"]").attr("selected", true);
        $("#serviceType option[value="+$("#requestCodeHid").val()+"]").attr("selected", true);
        $("#houseNo").val($("#houseNoHid").val());
        $("#moo").val($("#mooHid").val());
        $("#soi").val($("#soiHid").val());
        $("#road").val($("#roadHid").val());
        $("#custTelephone").val($("#phoneNumberHid").val());
        $("#custMobile").val($("#mobileHid").val());
        $("#custTelephone").focus();
        $("#custTelephone").blur();
        $("#custMobile").focus();
        $("#custMobile").blur();
        $("#custName").focus();
    }
    else
    {
        $("#custName").val('');
        $("#houseNo").val('');
        $("#moo").val('');
        $("#soi").val('');
        $("#road").val('');
        $("#custTelephone").val('');
        $("#custMobile").val('');
        $("#custTelephone").focus();
        $("#custTelephone").blur();
        $("#custMobile").focus();       
        $("#custMobile").blur();
        $("#custName").focus();
    }
})
    //ประเภทงานบริการหลังมาตร
    $("#serviceTypeSrh").select2({
		width: "100%",
		placeholder: "กรุณาเลือก",
		allowClear: true
	})
   //ประเภทงานบริการหลังมาตร
    $("#serviceType").select2({
		width: "100%",
		placeholder: "กรุณาเลือก",
		allowClear: true
	})
    afterLoad();
    
});


function setDefaultValue()
{
   $("#custName").val($("#custNameHid").val());
   $("#provinceCodeCtl option[value="+$("#provinceCodeHid").val()+"]").attr("selected", true);
   $("#amphurCode option[value="+$("#amphurCodeHid").val()+"]").attr("selected", true);
   $("#districtCode option[value="+$("#districtCodeHid").val()+"]").attr("selected", true);
   $("#serviceType option[value="+$("#requestCodeHid").val()+"]").attr("selected", true);
   $("#houseNo").val($("#houseNoHid").val());
   $("#moo").val($("#mooHid").val());
   $("#soi").val($("#soiHid").val());
   $("#road").val($("#roadHid").val());
   $("#custTelephone").val($("#phoneNumberHid").val());
   $("#custMobile").val($("#mobileHid").val());
   $("#custTelephone").click();
   $("#custTelephone").blur();
   $("#custMobile").click();
   $("#custMobile").blur();
   $("#custName").focus();

}
function setDDList()
{
	//===================== ชุด จังหวัด + อำเภอ + ตำบล =====================//
	//----- จังหวัด
	$("#provinceCodeCtl").select2({
		width: "100%",
		placeholder: "กรุณาเลือก",
		allowClear: true
	}).on('change', function(){
		$("#amphurCode").select2("val", "");
		$("#districtCode").select2("val", "");
		if($(this).select2("val").trim() == '')
		{
			$("#amphurCode").select2("readonly", true);
         $("#amphurCodeCtl").val('');
			$("#amphurNameCtl").val('');
			$("#districtCode").select2("readonly", true);
         $("#districtCodeCtl").val('');
			$("#districtNameCtl").val('');
			$("#zipCodeCtl").val('');
		}
		else
		{
			$("#amphurCode").select2("readonly", false);
         $("#amphurCodeCtl").val('');
			$("#amphurNameCtl").val('');
			$("#districtCode").select2("readonly", true);
         $("#districtCodeCtl").val('');
			$("#districtNameCtl").val('');
			$("#zipCodeCtl").val('');
		}
	});
	
	//----- อำเภอ
	$("#amphurCode").select2({
		ajax: {
            url: "BC11010EServlet?act=SRHAMPHUR",
			dataType: 'json',
			//term คือค่าที่ Key เข้ามาใน dropDownList
			data: function(term, page) {
				return {
					AmphurName : term
					, ProvinceCode : $("#provinceCodeCtl").val()
				};
			},
			results: function(data, page ) {
				//alert(data[0].text);
				//var test = [{text:data.objectName, children:[{id:data.objectCode, text:data.objectName}]}];
				return { results: data }
			}
		}
		, allowClear: true
		, placeholder: "กรุณาเลือก"
		, initSelection: function (elemement, callback) {
            return $.getJSON("BC11010EServlet?act=SRHAMPHUR", {ProvinceCode : $("#provinceCodeCtl").val()}, function(data) {
               amphurId = '';
               amphurName = '';
               if(typeof(data) !== 'undefined' && data.length > 0)
               {
                  for(i=0; i<data.length; i++)
                  {
                     amphurArray = data[i].id.split(":");
                     if(amphurArray[0] == element.val())
                     {
                        amphurId = amphurArray[0]; 
                        amphurName = amphurArray[1]; 
                        break;
                     }
                  }
               }
               return callback({ id: amphurId, text: amphurName });
            });
		}
	}).on('change', function(){
		$("#districtCode").select2("val", "");
		if($(this).select2("val").trim() == '')
		{
         $("#amphurCodeCtl").val('');
			$("#amphurNameCtl").val('');
			$("#districtCode").select2("readonly", true);
         $("#districtCodeCtl").val('');
			$("#districtNameCtl").val('');
			$("#zipCodeCtl").val('');
		}
		else
		{
			$("#districtCode").select2("readonly", false);
         $("#districtCodeCtl").val('');
			$("#districtNameCtl").val('');
			$("#zipCodeCtl").val('');
			var amphurArray = $(this).select2("val").split(":");
			$("#amphurCodeCtl").val(amphurArray[0]);
			$("#amphurNameCtl").val(amphurArray[1]);
		}
	});
	
	//----- ตำบล
	$("#districtCode").select2({
		ajax: {
			url: "BC11010EServlet?act=SRHDISTRICT",
			dataType: 'json',
			//term คือค่าที่ Key เข้ามาใน dropDownList
			data: function(term, page) {
				return {
					DistrictName : term
					, ProvinceCode : $("#provinceCodeCtl").val()
					, AmphurCode : $("#amphurCodeCtl").val()
				};
			},
			results: function(data, page ) {
				//alert(data[0].text);
				//var test = [{text:data.objectName, children:[{id:data.objectCode, text:data.objectName}]}];
				return { results: data }
			}
		}
		//, width:'300px'
		//, formatResult: formatList
		, allowClear: true
		, placeholder: "กรุณาเลือก"
		, initSelection: function (element, callback) {
			return $.getJSON("BC11010EServlet?act=SRHDISTRICT", 
               {ProvinceCode : $("#provinceCodeCtl").val(), AmphurCode : $("#amphurCodeCtl").val()}
               , function(data) {
               districtId = '';
               districtName = '';
               if(typeof(data) !== 'undefined' && data.length > 0)
               {
                  for(i=0; i<data.length; i++)
                  {
                     districtArray = data[i].id.split(":");
                     if(districtArray[0] == element.val()) {districtId = districtArray[0]; districtName = districtArray[1]; break;}
                  }
               }
            
               return callback({ id: districtId, text: districtName });
            });
		}
	}).on('change', function(){
		if($(this).select2("val").trim() == '')
		{
			$("#districtCodeCtl").val('');
			$("#districtNameCtl").val('');
			$("#zipCodeCtl").val('');
		}
		else
		{
			var districtArray = $(this).select2("val").split(":");
			
			$("#districtCodeCtl").val(districtArray[0]);
			$("#districtNameCtl").val(districtArray[1]);
			$("#zipCodeCtl").val(districtArray[2]);
		}
	});
    
    if($("#provinceCodeCtl").select2("val")=='')
	{
       $("#amphurCode").select2("readonly", true);
	}
	if($("#amphurCode").select2("val")=='')
	{
       $("#districtCode").select2("readonly", true);
	}
	
	//----- set ค่าตอน Inquiry มาแสดงที่จอภาพ
	if($("#amphurCodeCtl").val() != '')
	{
		$('#amphurCode').select2('data', {id:$("#amphurCodeCtl").val(), text:$("#amphurNameCtl").val()} );
	}
	if($("#districtCodeCtl").val() != '')
	{
		$('#districtCode').select2('data', {id:$("#districtCodeCtl").val(), text:$("#districtNameCtl").val()} );
	}
}
// End created by tosspoka 2015-05-03
function toggleForm(objectID)
{
   $("#"+objectID).toggle();
}
function createGrid() {
    jqGridBC11010E = jQuery("#masterGrid");
    //$(function () {

    $('#act').val('SRH'); // Added for serialize

    // Setup grid
    jqGridBC11010E.jqGrid({
           url: "../bc/BC11010EServlet?" + $("#frmBC11010E").serialize(),
        datatype: "json",
        mtype: 'POST',
        colNames: ['','', 'เลขที่คำร้อง', 'วันที่คำร้อง', 'ทะเบียนผู้ใช้น้ำ', 'ชื่อผู้ใช้น้ำ', 'ประเภทคำร้อง'],
        colModel: [{name: 'act', index: 'act',width: '3%',align: 'center',sortable: false,
            formatter: function(cellval, options, rowObject) {
                return "<span class=\"glyphicon glyphicon-pencil\" style=\"cursor:pointer;\" onclick=\"getData('" + options.rowId + "');\"><\/span>";}
        },{name: 'requestId',index: 'aoRequestControl.requestId',hidden: true
        },{name: 'requestIdDisplay',index: 'aoRequestControl.requestId', align: 'center',width: '12%'
        },{name: 'requestDateDisplay',index: 'aoRequestControl.requestDate',align: 'center',width: '20%'
        },{name: 'accountCode',index: 'aoRequestControl.accountCode',align: 'center',width: '10%'
        },{name: 'fullName',index: 'aoRequestControl.firstname',align: 'left',width: '20%'
        },{name: 'requestCodeDesc',index: 'aoRequestControl.requestCode',align: 'left',width: '15%'
        }],
        height: 300,width: 700,sortable: true,multiSort: true,autoencode: true,pager: "#masterGridPager",
        viewrecords: true, // display the number of total records from the query in the pager bar
        multiselect: false,
        loadComplete: function(data) {
            if (jqGridBC11010E.getGridParam("reccount") == 0) {
                // count data in grid
                //var htmlString = $("#reloading").html();
                if ($("#reloading").html() != "") {
                    $("#reloading").delay(3000).fadeOut();
                    $("#reloading").stop();
                    $("#reloading").fadeIn(0);
                }

            showMessage("reloading", "warning", "ไม่พบข้อมูลที่ต้องการค้นหา", "");
            } else if (jqGridBC11010E.getGridParam("reccount") != 0) {
            console.log();
               if($("#errButton").val() == 'มีข้อมูลนี้อยู่ในระบบแล้ว ไม่สามารถเพิ่มได้')
               {
                  $("#errButton").val('');
               }
               else
               {
                  $("#reloading").html("");
               }
            }
            $("#vaRequestIdSrhDiv").select();
            $("#vaRequestIdSrhDiv").focus();
        },
        beforeSelectRow: function(rowid, e) {
            if ($("#jqg_masterGrid_" + rowid).prop("disabled")) {
                return false;
            } else {
                return true;
            }
        },
        onSelectAll: function(aRowids, status) {
            if (status) {
                for (var i = 0; i < aRowids.length; i++) {
                    if ($("#jqg_masterGrid_" + aRowids[i]).prop("disabled")) {
                        $("#jqg_masterGrid_" + aRowids[i]).removeAttr("checked");
                    }
                }
                //modify the selarrrow parameter
                jqGridBC11010E[0].p.selarrrow = jqGridBC11010E.find("tr.jqgrow:has(td > input.cbox:checked)")
                    .map(function() {
                        return this.id;
                    }) // convert to set of ids
                    .get(); // convert to instance of Array
            }
        }
    });
    setTimeout(function() {
        $("#masterGrid").setGridWidth(parseInt($("#form_body").width()) - 20);
    }, 330);
    $(window).bind('resize', function() {
        $("#masterGrid").setGridWidth($("#form_body").width() - 20);
    }).trigger('resize');
}


function verify(paAct) {
    if (paAct == 'SRH') {
        searchData();
    } else if (paAct == 'OPNSRH') {
        openBarSearch();
    } else if (paAct == 'ADD') {
        addData();
    } else if (paAct == 'UPD') {
        editData();
    } else if (paAct == 'DEL') {
        confirmDelete();
    } else if (paAct == 'DELMLT') {
        deleteDataMultiple();
    } else if (paAct == 'CLR' || paAct == 'NEW') {
        newData();
    }
}
function openBarSearch() {
    $("#barSearch").show();
    $("#gridSearch").show();
    $("#form1").hide();
    $("#form2").hide();
    $("#form3").hide();
    $("#form4").hide();
    if (jqGridBC11010E == '') {
        createGrid();
    }
}
function formatStatus(cellvalue, options, rowObject) {
    var desc = '';
    if (cellvalue == '0') {
        desc = '<span style=\'color:red\'>Inactive<\/span>';
    }
    return desc;
}

function searchData() {
    $('#act').val('SRH'); // Added for serialize
    jqGridBC11010E.setGridParam({
        url: "../bc/BC11010EServlet?" + $("#frmBC11010E").serialize(),
        page: 1
    });
    jqGridBC11010E.trigger("reloadGrid");
}

function deleteData() {
    $("#act").val('DEL');
    $("#frmBC11010E").submit();
}

function confirmDelete() {
    $("#modalConfirm").html("คุณต้องการลบข้อมูลนี้หรือไม่");
    $("#modalButton").html("<button type=\"button\" class=\"btn btn-default btn-xs\" data-dismiss=\"modal\"><b>&nbsp;&nbsp;ยกเลิก&nbsp;&nbsp;<\/b><\/button><button type=\"button\" class=\"btn btn-primary btn-xs\" data-dismiss=\"modal\" onclick=\"deleteData();\"><b>&nbsp;&nbsp;ตกลง&nbsp;&nbsp;<\/b><\/button>");
    $('#myModal').modal('show');
}

function deleteDataMultiple() {
    var gr = jqGridBC11010E.getGridParam('selarrrow');

    var rowData = '';
    var requestId = new Array();
    for (var i = 0; i < gr.length; i++) {
        rowData = jqGridBC11010E.getRowData(gr[i]);
        requestId[i] = rowData.requestId;
    }
    if (gr != "")
        jqGridBC11010E.delGridRow(gr, {
            url: "../bc/BC11010EServlet",
            delData: {
                act: "DELMLT",
                requestId: requestId.toString()
            },
            reloadAfterSubmit: true,
            afterComplete: function(response, postdata, formid) {
                if ($("#reloading").html() != "") {
                    $("#reloading").delay(3000).fadeOut();
                    $("#reloading").stop();
                    $("#reloading").fadeIn(0);
                }
                //$("#reloading").stop();
                showMessage("reloading", "success", "ลบข้อมูลเรียบร้อยแล้ว", "");
                $("body").scrollTop(0);
            },
            errorTextFormat: function(response) {
                if (response.statusText == "D") {
                    return '<span class="ui-icon ui-icon-alert" ' + 'style="float:left; margin-right:.3em;"><\/span>' + "ลบข้อมูลไม่สำเร็จ";
                } else {
                    return '<span class="ui-icon ui-icon-alert" ' + 'style="float:left; margin-right:.3em;"><\/span>' + response.statusText;
                }
            }

        });
    else {
        $("#modalConfirm").html("กรุณาเลือกข้อมูลที่ต้องการลบ");
        $("#modalButton").html("<button type=\"button\" class=\"btn btn-primary btn-xs\" data-dismiss=\"modal\"><b>&nbsp;&nbsp;ตกลง&nbsp;&nbsp;<\/b>");

        $('#myModal').modal('show');
    }
}

function getData(id) {
    rowData = jqGridBC11010E.getRowData(id);
    $("#requestId").val(rowData.requestId);
    $("#accountCode").val(rowData.accountCode);
    $("#act").val('INQ');
    $("#frmBC11010E").submit();
}

function addData() {
    if (validateData()) {
        $("#act").val('ADD');
        $("#frmBC11010E").submit();
    }
}

function editData() {
    if (validateData()) {
        $("#act").val('UPD');
        $("#frmBC11010E").submit();
    }
}

function addCommas(y) {
    if (y.indexOf(",")) {
        x = y.replace(/,/g, "");
    } else {
        x = y;
    }
    var a;
    var check = x.split(".");
    if ((x.split(".").length > 1) && check[1]) {
        if (check[1] != "" && check[1] != "0") {
            a = parseFloat(x);
            a = Math.round(a * 100) / 100;
        }
    } else {
        a = x;
    }
    var parts = a.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    parts = parts.join(".");
    return parts;
}

function validateText(x) {
    x = x.replace(/[0-9]/g, "");
    return x;
}

function validateDouble(keyCode) {
    var isShift = false;
    if (keyCode == 16) {
        isShift = true;
    }
    if (((keyCode >= 48 && keyCode <= 57) || keyCode == 8 ||
            keyCode <= 37 || keyCode <= 39 || keyCode == 190 ||
            (keyCode >= 96 && keyCode <= 105)) && isShift == false) {
        return true;
    } else {
        return false;
    }
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
    month = ExpiryDate.substring(3, 5) - 1; // because months in JS start from 0
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

function validateData() {
    var vbRsl = false;
    var vaErrMsg = "กรุณาระบุ";
    var vaFocus = "";

    $("#serviceTypeDiv").removeClass("has-error");
        if ($("#serviceType").val() == '') {
            if (vaErrMsg != "กรุณาระบุ") vaErrMsg = vaErrMsg + ",";
            vaErrMsg = vaErrMsg + " ประเภทงานบริการหลังมาตร";
            if (vaFocus == "") {
            }
            $("#serviceTypeDiv").addClass("has-error");
        }
    $("#custNameDiv").removeClass("has-error");
        if ($("#custName").val() == '') {
            if (vaErrMsg != "กรุณาระบุ") vaErrMsg = vaErrMsg + ",";
            vaErrMsg = vaErrMsg + " ชื่อผู้แจ้ง(ที่ติดต่อได้)";
            if (vaFocus == "") {
                vaFocus = "custName";
            }
            $("#custNameDiv").addClass("has-error");
        }
      $("#custEmailDiv").removeClass("has-error");
        if (checkEmail($("#custEmail").val()) && $("#custEmail").val() != '') {
            if (vaErrMsg != "กรุณาระบุ") vaErrMsg = vaErrMsg + ",";
            vaErrMsg = vaErrMsg + " Email";
            if (vaFocus == "") {
                vaFocus = "custEmail";
            }
            $("#custEmailDiv").addClass("has-error");
        }
    if (vaErrMsg != 'กรุณาระบุ') {
        showMessage("reloading", "warning", vaErrMsg, vaFocus);
    } else {
        vbRsl = true;
    }

    return vbRsl;
}

function newData() {
    $("#act").val('NEW');
    $("#frmBC11010E").submit();
}

function getConfirm(confirmMessage, callback) {
    confirmMessage = confirmMessage || '';

    $('#confirmbox').modal({
        show: true,
        backdrop: false,
        keyboard: false
    });

    $('#confirmMessage').html(confirmMessage);
    $('#confirmFalse').click(function() {
        $('#confirmbox').modal('hide');
        if (callback) callback(false);

    });
    $('#confirmTrue').click(function() {
        $('#confirmbox').modal('hide');
        if (callback) callback(true);
    });
}