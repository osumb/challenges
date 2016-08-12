const banner = (message) => {
  $('.bannerMessage').remove();
  $('.navbar').after(`<h3 class="bannerMessage">${message}</h3>`);
};

module.exports = banner;
