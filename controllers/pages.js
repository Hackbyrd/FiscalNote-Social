var pages = {

  // login page
  index: function(req, res) {
    console.log('Index');
    res.redirect('/home');
  },

  home: function(req, res) {
    console.log('Home');
    res.render('pages/home', {
      title: "FiscalNote Social | Home",
      name: 'Jonathan'
    });
  },

  user: function(req, res) {
    console.log('User');
    res.render('pages/user', {
      title: "FiscalNote Social | User",
      name: 'Jonathan'
    });
  },

  stats: function(req, res) {
    console.log('Stats');
    res.render('pages/stats', {
      title: "FiscalNote Social | Stats",
      name: 'Jonathan'
    });
  },

  matches: function(req, res) {
    console.log('Matches');
    res.render('pages/matches', {
      title: "FiscalNote Social | Matches",
      name: 'Jonathan'
    });
  }

};

module.exports = pages;
