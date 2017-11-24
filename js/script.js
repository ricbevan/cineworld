var cineworldData = { attributes: {} };;
var chosenPerformanceDate = stripTimeFromDate(new Date());
var todaysDate = stripTimeFromDate(new Date());

$(document).ready(function() {

  if (!localStorage.cineworldData) {
    setTitle('Loading data from Cineworld...');
    getDataFromCineWorld();
  } else {
    cineworldData = JSON.parse(localStorage.cineworldData);

    if (!within1Day(cineworldData['lastUpdated'])) { // if cineworld data is over 1 day old
      getDataFromCineWorld();
    }

    renderPage();
  }

  $('#data').on('click', function(e) {
    if ($(e.target).data('cinema-id')) {
      localStorage.chosenCinema = $(e.target).data('cinema-id');
      $('html,body').scrollTop(0); // scroll to top
      renderCinemaPerformances();
    } else if ($(e.target).data('film-id')) {
      renderFilmDetails($(e.target).data('film-id'));
    } else if ($(e.target).data('performance-id')) {
      window.location.href = cineworldData['performances'][$(e.target).data('performance-id')].url;
    }
  });

  $('#days').on('click', function(e) {
    if ($(e.target).data('date')) {
      chosenPerformanceDate = stripTimeFromDate(new Date($(e.target).data('date')));
      renderPage();
    }
  });

  $('#back-to-cinemas').on('click', function() {
    localStorage.removeItem('chosenCinema');
    renderCinemas();
  });

  $('#refresh').on('click', function() {
    getDataFromCineWorld();
  });
});

$(window).on('load', function() {
  getFilmPosters();
});
