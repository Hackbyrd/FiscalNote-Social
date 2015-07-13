(function() {

  // when add new btn is clicked
  $(document).on('click', '#add-new-btn', function() {

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

  });

  // delete match form
  $(document).on('click', '.remove-match', function(event) {
    event.preventDefault();
    var num = $(this).attr('id').substring($(this).attr('id').length - 1);

    $('#form-matches-' + num).remove();
  });

}())
