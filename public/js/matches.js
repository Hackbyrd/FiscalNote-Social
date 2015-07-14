(function() {

  // when add new btn is clicked
  $(document).on('click', '#add-new-btn', function() {

    var len = $('.form-matches').length - 1;

    // make sure the user enters a match before adding another one
    if (len > -1 && ($('#select-custom-matches-' + len).val() == '-1' || $('#select-custom-unmatches-' + len).val() == '-1')) {
      alert('You must fill in this match/unmatch before you can add another.');
      $('#add-new-btn').blur();
    } else {
      $.ajax({
        url: window.location.origin + '/users',
        contentType: 'application/json',
        dataType: 'json',
        type: 'GET',
        success: function(data, status) {

          var str = '';
          var count = $('.form-matches').length;

          str += '<form class="form-inline form-matches" id="form-matches-' + count + '">';
          str += '<div class="form-group">';
          str += '<select class="form-control select-custom-matches" id="select-custom-matches-' + count + '">';
          str += '<option value="-1">None</option>';

          for (var s = 0; s < data.length; s++) {
            str += '<option value="' + data[s].index + '">' + data[s].firstname + ' ' + data[s].lastname + '</option>';
          }

          str += '</select>';
          str += '</div>';
          str += '<div class="form-group">';
          str += '<select class="form-control select-custom-unmatches" id="select-custom-unmatches-' + count + '">';
          str += '<option value="-1">None</option>';

          for (var s = 0; s < data.length; s++) {
            str += '<option value="' + data[s].index + '">' + data[s].firstname + ' ' + data[s].lastname + '</option>';
          }

          str += '</select>';
          str += '</div>';
          str += '<div class="form-group">';
          str += '<select class="form-control select-custom-matches-unmatches" id="select-custom-matches-unmatches-' + count + '">';
          str += '<option value="match">Match</option>';
          str += '<option value="unmatch">Unmatch</option>';
          str += '</select>';
          str += '<button class="remove-match" id="remove-match-' + count + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
          str += '</div>';
          str += '</form>';

          $(str).insertBefore('#add-new-btn');
          $('#add-new-btn').blur();

        }

      });
    }

  });

  // delete match form
  $(document).on('click', '.remove-match', function(event) {
    event.preventDefault();
    var num = $(this).attr('id').substring($(this).attr('id').length - 1);

    $('#form-matches-' + num).remove();
  });

  // run match query
  $(document).on('click', '#run-match', function(event) {
    event.preventDefault();
    $('#run-match').blur();

    $('#run-match').html("Processing...");

    var selectMatchesArr = $('.select-custom-matches');
    var selectUnmatchesArr = $('.select-custom-unmatches');
    var selectMatchesUnmatchesArr = $('.select-custom-matches-unmatches');
    var customMatchesJSON = { matches: {}, unmatches: {}};

    // check to see if everything is filled
    for (var i = 0; i < selectMatchesArr.length; i++) {
      if (selectMatchesArr[i].value === '-1' || selectUnmatchesArr[i].value === '-1') {
        alert('Must fill in all matches/unmatches');
        return;
      }
    }

    // get custom matches
    for (var i = 0; i < selectMatchesArr.length; i++) {
      if (selectMatchesUnmatchesArr[i].value === 'match') {
        customMatchesJSON.matches[selectMatchesArr[i].value] = [Number(selectUnmatchesArr[i].value)];
        customMatchesJSON.matches[selectUnmatchesArr[i].value] = [Number(selectMatchesArr[i].value)];
      } else {
        customMatchesJSON.unmatches[selectMatchesArr[i].value] = [Number(selectUnmatchesArr[i].value)];
        customMatchesJSON.unmatches[selectUnmatchesArr[i].value] = [Number(selectMatchesArr[i].value)];
      }
    }

    // set up include exclude arrays
    var excludeList = $('.checkbox-exclude');
    var includeList = $('.checkbox-include');
    var excludeJSON = [];
    var includeJSON = [];

    for (var i = 0; i < excludeList.length; i++) {
      if (excludeList[i].checked) {
        excludeJSON.push(i);
      }
       if (includeList[i].checked) {
        includeJSON.push(i);
      }
    }

    // get other info
    var officeList = $('.checkbox-office');
    var statusList = $('.checkbox-status');
    var groupSizeList = $('.radio-group-size');
    var officeJSON = [];
    var statusJSON = [];
    var groupSizeJSON;
    var departmentWeightJSON = Number($('#select-department-weight').val());

    // office
    for (var i = 0; i < officeList.length; i++) {
      if (officeList[i].checked) {
        officeJSON.push(officeList[i].value);
      }
    }

    // status
    for (var i = 0; i < statusList.length; i++) {
      if (statusList[i].checked) {
        statusJSON.push(statusList[i].value);
      }
    }

    // group size
    for (var i = 0; i < groupSizeList.length; i++) {
      if (groupSizeList[i].checked) {
        groupSizeJSON = Number(groupSizeList[i].value);
      }
    }

    // make ajax call with values
    $.ajax({
      url: window.location.origin + '/match',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({
        custom: customMatchesJSON,
        exclude: excludeJSON,
        include: includeJSON,
        office: officeJSON,
        status: statusJSON,
        groupSize: groupSizeJSON,
        departmentWeight: departmentWeightJSON
      }),
      success: function(data, status) {
        window.location.href = window.location.origin + '/matches';
        $('#run-match').html("Done!");
      }
    });

  });

  // switch to create match tab
  $(document).on('click', '#create-match-btn', function(event) {
    event.preventDefault();

    $('#show-matches').addClass('hidden');
    $('#create-match').removeClass('hidden');
  });

  // switch to show match tab
  $(document).on('click', '#show-matches-btn', function(event) {
    event.preventDefault();

    $('#create-match').addClass('hidden');
    $('#show-matches').removeClass('hidden');
  });

}())
