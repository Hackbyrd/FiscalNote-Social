(function() {

  // first show all users
  $('#all-users-container').removeClass('hidden');

  // get all users, instantly called, but stored as a variable for later use
  // params is a string of url arguments, example: params = '?sort=-firstname';
  var getAllUsers = function(params) {

    // get url params
    var urlParams = params || '?sort=firstname';

    $.ajax({
      url: window.location.origin + '/users' + urlParams,
      contentType: 'application/json',
      dataType: 'json',
      type: 'GET',
      success: function(data, status) {
        var rowData = ''; // data to insert in to table

        // remove all user rows and their data
        $( ".all-users-table-body" ).remove();
        rowData += '<tbody id="all-users-table-body">';

        // loop
        for (var i = 0; i < data.length; i++) {

          // convert dates
          var startdate = new Date(data[i].startdate);
          var birthday = new Date(data[i].birthday);

          rowData += '<tr class="all-users-table-body-row" id="' + data[i].index + '">';
          rowData += '<th class="all-users-table-body-col">' + (data[i].firstname || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].lastname || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (startdate.getMonth() + 1) + '/' + startdate.getDate() + '/' + startdate.getFullYear() + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (birthday.getMonth() + 1) + '/' + birthday.getDate() + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].email || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].phone || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].education || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].sex || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].position || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].fngroupid || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].department || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].employement || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].office || 'Unknown') + '</th>';
          rowData += '<th class="all-users-table-body-col">' + (data[i].extention || 'Unknown') + '</th>';
          rowData += '</tr>';
        }

        rowData += '</tbody>';

        // insert new data
        $(rowData).insertAfter('#all-users-table-header');

      }
    });
  };

  // run this by default first to load page
  getAllUsers();

  // JQUERY click events
  $(document).ready(function() {

    // sort table when header is clicked on
    $(document).on('click', '.all-users-table-header-col', function() {
      var params = '?sort='; // params to pass into ajax call for get All Users
      var sort = this.getAttribute('name'); // the name of the col
      var headerArr = document.getElementsByClassName('all-users-table-header-col'); // get all elements in col

      // change all names to none
      for (var i = 0; i < headerArr.length; i++) {
        $(headerArr[i]).attr('name', 'none');
      }

      // if ascending already, make descend, otherwise make ascend
      if (sort === 'ascending') {
        params += '-'; // this makes mongo sort by decending order
        $(this).attr('name', 'descending'); // set to descending
      } else {
        $(this).attr('name', 'ascending'); // set to ascending
      }

      // add col id to params to sort by
      params += '' + this.id;

      // call get all users function
      getAllUsers(params);

    });

    // click on individual page
    $(document).on('click', '.all-users-table-body-row', function() {

      var id = this.id; // get id

      $.ajax({
        url: window.location.origin + '/user/' + id,
        contentType: 'application/json',
        dataType: 'json',
        type: 'GET',
        success: function(data, status) {

          // convert dates
          var startdate = new Date(data.startdate);
          var birthday = new Date(data.birthday);

          // show correct html
          $('#user-container').removeClass('hidden');
          $('#all-users-container').addClass('hidden');

          // empty divs
          $('#user-col-left').empty();
          $('#user-col-right').empty();

          // left side
          $('#user-col-left').append('<div class="row"');
          $('#user-col-left').append('<img src="images/profiles/' + data.email + '.jpg" alt="' + data.firstname + ' ' + data.lastname + '" class="img-thumbnail">');
          $('#user-col-left').append('<p>Birthday: ' + (birthday.getMonth() + 1) + '/' + birthday.getDate() + '</p>');
          $('#user-col-left').append('</div>');

          // right side
          $('#user-col-right-name').append('<h1>' + data.firstname + ' ' + data.lastname + '</h1>');
          $('#user-col-right').append('<hr>');
        }
      });

    });

  });

}());
