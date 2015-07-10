(function(){
  $(document).ready(function(){
    // when a nav link is clicked
    $(document).on('click', '.nav-link', function() {
      $('.active').removeClass('active'); // remove active
      $(this).addClass('active'); // add active
    });
  });
}());
