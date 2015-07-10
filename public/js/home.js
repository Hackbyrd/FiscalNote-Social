(function() {

  // get all users, instantly called, but stored as a variable for later use
  // params is a string of url arguments, example: params = '?sort=-firstname';
  var getAllUsers = function(params) {

    // get url params
    var urlParams = params || '?sort=index';

    $.ajax({
      url: window.location.origin + '/users' + urlParams,
      contentType: 'application/json',
      dataType: 'json',
      type: 'GET',
      success: function(data, status) {
        var rowData = ''; // data to insert in to table

        // shorten location name
        var location = {
          'Washington, D.C.': 'DC',
          'New York City': 'NYC',
          'Seoul, Korea': 'Seoul',
          'Remote': 'Remote'
        }

        // remove all user rows and their data
        $( "#all-users-table-body" ).remove();
        rowData += '<tbody id="all-users-table-body">';

        // loop
        for (var i = 0; i < data.length; i++) {

          // convert dates
          var startdate = new Date(data[i].startdate);
          var birthday = new Date(data[i].birthday);

          rowData += '<tr class="all-users-table-body-row" id="' + data[i].index + '">';
          rowData += '<td class="all-users-table-body-col index-col">' + (data[i].index + 1) + '</td>';
          rowData += '<td class="all-users-table-body-col firstname-col">' + (data[i].firstname || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col lastname-col">' + (data[i].lastname || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col startdate-col">' + (startdate.getMonth() + 1) + '/' + startdate.getDate() + '/' + startdate.getFullYear() + '</td>';
          rowData += '<td class="all-users-table-body-col birthday-col">' + (birthday.getMonth() + 1) + '/' + birthday.getDate() + '</td>';
          rowData += '<td class="all-users-table-body-col email-col">' + (data[i].email || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col phone-col">' + (data[i].phone || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col education-col">' + (data[i].education || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col sex-col">' + (data[i].sex || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col position-col">' + (data[i].position || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col fngroupid-col">' + (data[i].fngroupid || 'None') + '</td>';
          rowData += '<td class="all-users-table-body-col department-col">' + (data[i].department || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col status-col">' + (data[i].status || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col office-col">' + (location[data[i].office] || 'Unknown') + '</td>';
          rowData += '<td class="all-users-table-body-col extention-col">' + (data[i].extention || 'Unknown') + '</td>';
          rowData += '</tr>';
        }

        rowData += '</tbody>';

        // insert new data
        $(rowData).insertAfter('#all-users-table-header');

        var headerArr = document.getElementsByClassName('all-users-table-header-col'); // get all elements in col
        var purpleId;

        // find selected col
        for (var i = 0; i < headerArr.length; i++) {
          if ($(headerArr[i]).attr('name') !== 'none') {
            purpleId = headerArr[i].id;
          }
        }

        var changeToPurple = $('.' + purpleId + '-col');

        for (var i = 0; i < changeToPurple.length; i++) {
          changeToPurple[i].style.backgroundColor = '#846f94';
          changeToPurple[i].style.color = 'white';
        }

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

      // var changeColorBack;

      // change all names to normal
      for (var i = 0; i < headerArr.length; i++) {
        console.log(headerArr[i]);
        $(headerArr[i]).attr('name', 'none');
        headerArr[i].style.backgroundColor = 'white';
        headerArr[i].style.color = 'black';
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

      // call get all users function, and change to purple
      getAllUsers(params);

    });

  });

}());
