(function(){
  $(document).ready(function() {

    // back button is clicked
    $(document).on('click', '#user-back-btn', function() {
      window.location.href = window.location.origin + '/home';
    });

  });
}());
