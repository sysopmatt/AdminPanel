// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#mainArea table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#mainArea table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.samAccountName + '" title="Show Details">' + this.GivenName + ' ' + this.Surname + '</a></td>';
            tableContent += '<td>' + this.mail + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#mainArea table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.samAccountName; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoGivenName').text(thisUserObject.GivenName);
    $('#userInfoSurname').text(thisUserObject.Surname);
    $('#userInfoEmail').text(thisUserObject.mail);
    $('#userInfoUserName').text(thisUserObject.samAccountName);
    $('#userInfoDepartment').text(thisUserObject.department);
    $('#userInfoTelephoneNumber').text(thisUserObject.telephoneNumber);
    $('#userInfoExtension').text(thisUserObject.ipPhone);
    $('#userInfoMobile').text(thisUserObject.mobile);
    $('#userInfoLocation').text(thisUserObject.physicalDeliveryOfficeName);
    $('#userInfoTitle').text(thisUserObject.title);
    

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'GivenName': $('#addUser fieldset input#inputUserGivenName').val(),
            'Surname': $('#addUser fieldset input#inputUserSurname').val(),
            'mail': $('#addUser fieldset input#inputUserEmail').val(),
            'samAccountName': $('#addUser fieldset input#inputUserUserName').val(),
            'department': $('#addUser fieldset input#inputUserDepartment').val(),
            'telephoneNumber': $('#addUser fieldset input#inputUserTelephoneNumber').val(),
            'ipPhone': $('#addUser fieldset input#inputUserExtension').val(),
            'mobile': $('#addUser fieldset input#inputUserMobile').val(),
            'physicalDeliverOfficeName': $('#addUser fieldset input#inputUserLocation').val(),
            'title': $('#addUser fieldset input#inputUserTitle').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};