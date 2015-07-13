(function() {
  $(document).ready(function(){

    // make navbar active
    if (window.location.pathname === '/team' || window.location.pathname.indexOf('fnuser') >= 0) {
      $('#nav-tab-team').addClass('active');
    } else if (window.location.pathname === '/home') {
      $('#nav-tab-home').addClass('active');
    } else if (window.location.pathname === '/matches') {
      $('#nav-tab-matches').addClass('active');
    } else if (window.location.pathname === '/stats') {
      $('#nav-tab-stats').addClass('active');
    }

  });
}());
