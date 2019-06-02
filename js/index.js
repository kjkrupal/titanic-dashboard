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
        theme: 'bootstrap',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#name").jqxInput({theme: 'bootstrap',width: 150, height: 23});
    $("#age").jqxNumberInput({ 
        theme: 'bootstrap',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#ticket").jqxInput({theme: 'bootstrap',width: 150, height: 23});
    $("#cabin").jqxInput({theme: 'bootstrap',width: 150, height: 23});
    $("#sibsp").jqxNumberInput({ 
        theme: 'bootstrap',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0, 
        spinButtons: true 
    });
    $("#parch").jqxNumberInput({ 
        theme: 'bootstrap',
        spinMode: 'simple',
        inputMode: 'simple',
        width: 150, 
        min: 0, 
        height: 23,
        decimalDigits: 0,
        spinButtons: true 
    });
    $("#fare").jqxNumberInput({ 
        theme: 'bootstrap',
        spinMode: 'simple',
        inputMode: 'simple', 
        width: 150, 
        min: 0, 
        height: 23, 
        spinButtons: true 
    });
    $("#embarked").jqxDropDownList({ 
        theme: 'bootstrap',
        source: embarked,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#sex").jqxDropDownList({ 
        theme: 'bootstrap',
        source: sex,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#survived").jqxDropDownList({ 
        theme: 'bootstrap',
        source: survived,
        placeHolder: '-- Select --',
        autoDropDownHeight: true,
        width: 150, 
        displayMember: 'text',
        valueMember: 'value'
    });
    $("#pclass").jqxDropDownList({ 
        theme: 'bootstrap',
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
        theme: 'bootstrap',
        width: '75%',
        pageable: true,
        pagerButtonsCount: 10,
        source: dataAdapter,
        columnsResize: true,
        autorowheight: true,
        autoheight: true,
        showToolbar: true,
        altrows: true,
        columns: [
            { text: 'Name', dataField: 'name', width: 100},
            { text: 'Age', dataField: 'age', width: 50},
            { 
                text: 'Sex', 
                dataField: 'sex', 
                width: 100,
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
                width: 100,
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
                width: 50,
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
            { text: 'Ticket', dataField: 'ticket', width: 100},
            { text: 'Fare', dataField: 'fare', width: 100},
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
        
        var containerA = $("<div style='margin-left: 30px; float: left;'></div>");
        var input = $("<div><input id='addrowbutton' type='button' value='Add New Row' /></div>");
        toolbar.append(containerA);
        containerA.append(input);

        var containerB = $("<div style='margin-left: 30px; float: left;'></div>");
        var upload = $("<div><input id='uploadButton' type='button' value='Upload CSV' /></div>");
        toolbar.append(containerB);
        containerB.append(upload);
        
        
        $("#addrowbutton").jqxButton({theme: 'bootstrap',});
        $("#addrowbutton").bind('click', function () {
            
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

        $("#uploadButton").jqxButton({theme: 'bootstrap',});
        $("#uploadButton").bind('click', function () {
            
            $("#uploadTitle").text("Upload CSV");
            var offset = $("#jqxgrid").offset();
            $("#uploadWindow").jqxWindow({ position: { x: parseInt(offset.left) + 60, y: parseInt(offset.top) + 60 } });
            
            $("#uploadWindow").jqxWindow('open');
        
        });


      }
    });
    
    $("#uploadWindow").jqxWindow({
        theme: 'bootstrap', 
        width: 375, height: 200, 
        resizable: false,  
        isModal: true, 
        autoOpen: false, 
        cancelButton: $("#cancelUpload"), 
        modalOpacity: 0.6          
    });
    
    $("#cancelUpload").jqxButton({theme: 'bootstrap'});
    $("#uploadSave").jqxButton({theme: 'bootstrap'});

    $("#popupWindow").jqxWindow({
        theme: 'bootstrap', 
        width: 375, height: 500, 
        resizable: false,  
        isModal: true, 
        autoOpen: false, 
        cancelButton: $("#Cancel"), 
        modalOpacity: 0.6           
    });
    
    $("#Cancel").jqxButton({theme: 'bootstrap'});
    $("#Save").jqxButton({theme: 'bootstrap'});
    
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