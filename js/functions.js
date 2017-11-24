function cssSafe(text) { // remove all non alphanumeric characters
  return text.replace(/[^a-zA-Z0-9]+/g, '');
}

function fixCinemaName(cinemaName) {
  return cinemaName.replace('Cineworld ', '');
}

function setTitle(title) {
  $('#title').text(title);
}

function stripTimeFromDate(date) {
  return new Date(date).setHours(0, 0, 0, 0);
}

function fixPerformanceAttributes(attributes) {
  var fixedPerformanceAttributes = '';

  attributes.sort();

  for (attribute in attributes) {
    fixedPerformanceAttributes += cineworldData['attributes'][attributes[attribute]] + ', ';
  }

  return fixedPerformanceAttributes.replace(/,\s*$/, ""); // remove last comma
}

function sortList(a, b){
    return ($(b).text()) < ($(a).text()) ? 1 : -1;
}

function getFilmPosters() {
  for (film in cineworldData['films']) {
    var img = new Image();
    img.src = cineworldData['films'][film].posterUrl;
  }
}

function within30Minutes(time) {
  withinTime(time, 1800000);
}

function within1Day(time) {
  withinTime(time, 86400000);
}

function withinTime(time, milliseconds) {
  return (new Date() - new Date(time)) > milliseconds;
}
