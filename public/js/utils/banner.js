const banner = (message) => {
  $('.BannerMessage').remove();
  $('.Navbar').after(`<h3 class="BannerMessage">**${message}**</h3>`);
};

module.exports = banner;
