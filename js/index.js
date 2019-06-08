$(document).ready(function () {
            
    var oauthURL = "http://localhost:8080/oauth/token";
    var token_ // variable will store the token
    var userName = "devglan-client"; // app clientID
    var password = "devglan-secret"; // app clientSecret
    var request = new XMLHttpRequest(); 

    function getToken(url, clientID, clientSecret) {
        var key;           
        request.open("POST", url, false); 
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Authorization", "Basic " + btoa(userName + ":" + password));                    request.send("grant_type=client_credentials"); // specify the credentials to receive the token on request
        if (request.readyState == request.DONE) {
            var response = request.responseText;
            var obj = JSON.parse(response); 
            key = obj.access_token; //store the value of the accesstoken
            return key; // store token in your global variable "token_" or you could simply return the value of the access token from the function
        }
        
    }

    token_ = getToken(oauthURL, userName, password);

    var getURL = "http://localhost:8080/titanic/passengers";
    var putURL = "http://localhost:8080/titanic/passenger";
    var postURL = "http://localhost:8080/titanic/passenger";
    var delURL = "http://localhost:8080/titanic/passenger/";
    var uplURL = "http://localhost:8080/titanic/passengers?";

    var survived = [
        {text: "Yes", value : 1},
        {text: "No", value : 0}
    ];
    var sex = [
        {text: "Male", value : "male"},
        {text: "Female", value : "female"}
    ];
    var pclass = [
        {text: "First", value : 1},
        {text: "Second", value : 2},
        {text: "Third", value : 3},
    ];
    var embarked = [
        {text: "Cherbourg", value : "C"},
        {text: "Queenstown", value : "Q"},
        {text: "Southampton", value : "S"}
    ];

    $("#passengerId").jqxNumberInput({ 
        theme: 'custom',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#name").jqxInput({theme: 'custom',width: 150, height: 23});
    $("#age").jqxNumberInput({ 
        theme: 'custom',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#ticket").jqxInput({theme: 'custom',width: 150, height: 23});
    $("#cabin").jqxInput({theme: 'custom',width: 150, height: 23});
    $("#sibsp").jqxNumberInput({ 
        theme: 'custom',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#parch").jqxNumberInput({ 
        theme: 'custom',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0,
        spinButtons: true 
    });
    $("#fare").jqxNumberInput({ 
        theme: 'custom',
        spinMode: 'simple',
        inputMode: 'simple', 
        width: 150, 
        min: 0, 
        height: 23, 
        spinButtons: true 
    });
    $("#embarked").jqxDropDownList({ 
        theme: 'custom',
        source: embarked,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#sex").jqxDropDownList({ 
        theme: 'custom',
        source: sex,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#survived").jqxDropDownList({ 
        theme: 'custom',
        source: survived,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#pclass").jqxDropDownList({ 
        theme: 'custom',
        source: pclass,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    
    // prepare the data
    var source =
    {
        dataType: "json",
        dataFields: [
            { name: 'id', type: 'int'},
            { name: 'passengerId', type: 'int'},
            { name: 'survived', type: 'int'},
            { name: 'pclass', type: 'int'},
            { name: 'name', type: 'string'},
            { name: 'sex', type: 'string'},
            { name: 'age', type: 'int'},
            { name: 'sibsp', type: 'int'},
            { name: 'parch', type: 'int'},
            { name: 'ticket', type: 'string'},
            { name: 'fare', type: 'int'},
            { name: 'cabin', type: 'int'},
            { name: 'embarked', type: 'string'}
        ],
        id: 'id',
        url: getURL,
        addRow: function (rowID, rowData, position, commit) {
            rowData['pclass'] = parseInt(rowData['pclass']);
            rowData['survived'] = parseInt(rowData['survived']);
            $.ajax({
                cache: false,
                url: postURL + '?' + $.param({'access_token': token_}),
                data: JSON.stringify(rowData),
                type: "POST",
                contentType: 'application/json',
                success: function (data, status, xhr) {
                    commit(true, data.id);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    commit(false);
                }
            });
        },
        updateRow: function (rowID, rowData, commit) {
            rowData['id'] = parseInt(rowID);
            rowData['pclass'] = parseInt(rowData['pclass']);
            rowData['survived'] = parseInt(rowData['survived']);
            $.ajax({
                cache: false,
                url: putURL + '?' + $.param({'access_token': token_}),
                data: JSON.stringify(rowData),
                type: "PUT",
                contentType: 'application/json',
                success: function (data, status, xhr) {
                    commit(true, data.id);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    commit(false);
                }
            });
            
        },
        deleteRow: function (rowID, commit) {
            var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', rowID);    
            var id = dataRecord.id;
            $.ajax({
                cache: false,
                url: delURL + id + '?' + $.param({'access_token': token_}),
                type: "DELETE",
                success: function (data, status, xhr) {
                    commit(true);
                    $('#jqxgrid').jqxGrid('updatebounddata');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    commit(false);
                }
            }); 
            
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source, {
        formatData: function(data) {
            data.access_token = token_;
            return data;
        }
    });

    var editrow = -1;
    var deleterow =  -1;
    
    var editForm = false;
    var createForm = false;

    $("#jqxgrid").jqxGrid(
    {
        theme: 'custom',
        width: 890,
        pageable: true,
        pagerButtonsCount: 10,
        source: dataAdapter,
        columnsResize: true,
        autorowheight: true,
        autoheight: true,
        showToolbar: true,
        altrows: true,
        sortable: true,
        filterable:true,
        autoshowloadelement:false,
        columns: [
            { text: 'Name', dataField: 'name', width: 100},
            { text: 'Age', dataField: 'age', width: 40},
            { 
                text: 'Sex', 
                dataField: 'sex', 
                width: 60,
                cellsformat: 'c2',
                cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                    var cell_sex = value.toLowerCase();
                    for(var i = 0; i < sex.length; i++) {
                        if(sex[i].value === cell_sex)
                            return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + ';">' + sex[i].text + '</span>';
                    }
                }
            },
            { 
                text: 'P Class', 
                dataField: 'pclass', 
                width: 70,
                cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                    var cell_pclass = value;
                    for(var i = 0; i < pclass.length; i++) {
                        if(pclass[i].value === cell_pclass)
                            return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + ';">' + pclass[i].text + '</span>';
                    }

                }
            },
            { 
                text: 'Survived', 
                dataField: 'survived', 
                width: 60,
                cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                    var cell_survived = value;
                    for(var i = 0; i < survived.length; i++) {
                        if(survived[i].value === cell_survived)
                            return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + ';">' + survived[i].text + '</span>';
                    }

                }
            },
            { text: 'SIBSP', dataField: 'sibsp', width: 50},
            { text: 'PARCH', dataField: 'parch', width: 50},
            { text: 'Ticket', dataField: 'ticket', width: 80},
            { text: 'Fare', dataField: 'fare', width: 60},
            { text: 'Cabin', dataField: 'cabin', width: 100},
            { 
                text: 'POE', 
                dataField: 'embarked', 
                width: 100,
                cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                    var cell_embarked = value;
                    for(var i = 0; i < embarked.length; i++) {
                        if(embarked[i].value === cell_embarked)
                            return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + ';">' + embarked[i].text + '</span>';
                    }

                }
            },
            { 
                text: 'Edit',
                width: 50,
                datafield: 'Edit', 
                columntype: 'button', 
                cellsrenderer: function () {
                    return "Edit";
                }, 
                buttonclick: function (row) {
                    // open the popup window when the user clicks a button.
                    editForm = true;
                    createForm = false;
                    editrow = row;
                    $("#formTitle").text("Edit");
                    var offset = $("#jqxgrid").offset();
                    $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
                    // get the clicked row's data and initialize the input fields.
                    var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', editrow);
                    $("#passengerId").val(dataRecord.passengerId);
                    $("#name").val(dataRecord.name);
                    $("#age").val(dataRecord.age);
                    $("#ticket").val(dataRecord.ticket);
                    $("#cabin").val(dataRecord.cabin);
                    $("#sibsp").val(dataRecord.sibsp);
                    $("#parch").val(dataRecord.parch);
                    $("#fare").val(dataRecord.fare);
                    $("#embarked").jqxDropDownList('val', dataRecord.embarked);
                    $("#sex").jqxDropDownList('val', dataRecord.sex);
                    $("#survived").jqxDropDownList('val', dataRecord.survived);
                    $("#pclass").jqxDropDownList('val', dataRecord.pclass);
                    // show the popup window.
                    $("#popupWindow").jqxWindow('open');
                }
            },
            { 
                text: 'Delete',
                width: 70,
                datafield: 'Delete', 
                columntype: 'button', 
                cellsrenderer: function () {
                    return "Delete";
                }, 
                buttonclick: function (row) {
                    $("#jqxgrid").jqxGrid('deleterow', row);
                }
            }
      ],
      renderToolbar: function(toolbar) {
       
        var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
        var addButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='jqwidgets/styles/images/plus_white.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Add</span></div>"); 
        var uploadButton = $("<div style='float: left; margin-left: 5px;'><img style='position: relative; margin-top: 2px;' src='jqwidgets/styles/images/upload.png'/><span style='margin-left: 4px; position: relative; top: -3px;'>Upload CSV</span></div>");
    
        container.append(addButton);
        container.append(uploadButton);
        toolbar.append(container);
        
        
        addButton.jqxButton({theme: 'custom', width: 65, height: 20});
        addButton.click(function () {
            
            editForm = false;
            createForm = true;
            $("#formTitle").text("Create");
            var offset = $("#jqxgrid").offset();
            $("#popupWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });

            $("#passengerId").jqxNumberInput('val', null);
            $("#name").jqxInput('val', '');
            $("#age").jqxNumberInput('val', null);
            $("#ticket").jqxInput('val', '');
            $("#cabin").jqxInput('val', '');
            $("#sibsp").jqxNumberInput('val', 0);
            $("#parch").jqxNumberInput('val', 0);
            $("#fare").jqxNumberInput('val', 0);
            $("#embarked").jqxDropDownList('clearSelection', true);
            $("#sex").jqxDropDownList('clearSelection', true);
            $("#survived").jqxDropDownList('clearSelection', true);
            $("#pclass").jqxDropDownList('clearSelection', true);
            
            $("#popupWindow").jqxWindow('open');
        
        });

        uploadButton.jqxButton({theme: 'custom',width: 85, height: 20});
        uploadButton.click(function () {
            
            $("#uploadTitle").text("Upload CSV");
            var offset = $("#jqxgrid").offset();
            $("#uploadWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
            
            $("#uploadWindow").jqxWindow('open');
        
        });


      },
      

    });
  
    $("#uploadWindow").jqxWindow({
        theme: 'custom', 
        width: 375, height: 200, 
        resizable: false,  
        isModal: true, 
        autoOpen: false, 
        cancelButton: $("#cancelUpload"), 
        modalOpacity: 0.6          
    });
    
    $("#uploadSave").bind('click', function () {
            
        var myFile = $('#fileSelect');
        var csvFile = myFile[0].files[0];

        var form = $('#uploadForm')[0];
        var formData = new FormData(form);
        

        if(myFile === '') {
            $('#uploadError').text('Please select a file to upload');
        } else {
            
            $.ajax({
                cache: false,
                url: uplURL + $.param({'access_token': token_}),
                data: formData,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (data, status, xhr) {
                    $('#jqxgrid').jqxGrid('updatebounddata');
                    $('#uploadWindow').jqxWindow('close');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    
                }
            });
            
        }
    
    });

    $("#cancelUpload").jqxButton({theme: 'custom'});
    $("#uploadSave").jqxButton({theme: 'custom'});

    

    $("#popupWindow").jqxWindow({
        theme: 'custom', 
        width: 375, height: 500, 
        resizable: false,  
        isModal: true, 
        autoOpen: false, 
        cancelButton: $("#Cancel"), 
        modalOpacity: 0.6           
    });
    $("#Cancel").jqxButton({theme: 'custom'});
    $("#Save").jqxButton({theme: 'custom'});
    
    $("#Save").click(function () {
        var row = { 
            "passengerId": $("#passengerId").val(),
            "survived": $("#survived").val(),
            "pclass": $("#pclass").val(),
            "name": $("#name").val(),
            "sex": $("#sex").val(),
            "age": $("#age").val(),
            "sibsp": $("#sibsp").val(),
            "parch": $("#parch").val(),
            "ticket": $("#ticket").val(),
            "fare": $("#fare").val(),
            "cabin": $("#cabin").val(),
            "embarked": $("#embarked").val()
        };
        
        var rowID = $('#jqxgrid').jqxGrid('getrowid', editrow);

        if(editForm) {
            $('#jqxgrid').jqxGrid('updaterow', rowID, row);
        } else {
            $('#jqxgrid').jqxGrid('addrow', rowID, row);
        }

        $("#popupWindow").jqxWindow('hide');
    });

});
