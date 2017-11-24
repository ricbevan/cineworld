function renderPage() {
  if (localStorage.chosenCinema) {
    renderCinemaPerformances();
    renderDays();
  } else {
    renderCinemas();
  }
}

function renderCinemas() {
  setTitle('Cinemas');
  $('#back-to-cinemas, #days').addClass('uk-hidden');
  var cinemaList = $('#data').empty();

  for (cinema in cineworldData['cinemas']) {
    cinemaList.append(
      $('<li>')
        .append(
          $('<h2>')
            .text(fixCinemaName(cineworldData['cinemas'][cinema].name))
            .addClass('uk-h3 uk-light uk-display-inline-block cin-link')
            .data({
              'cinema-id': cinema
            })
        )

    );
  }

  $('#data > li').sort(sortList).appendTo('#data');
}

function renderCinemaPerformances() {
  setTitle(fixCinemaName(cineworldData['cinemas'][localStorage.chosenCinema].name));
  $('#back-to-cinemas, #days').removeClass('uk-hidden');
  var performancesList = $('#data').empty();

  for (performance in cineworldData['performances']) {
    var performanceTitle = cineworldData['films'][cineworldData['performances'][performance].film].title;
    var performanceAttributes = fixPerformanceAttributes(cineworldData['performances'][performance].attributes);

    if (cineworldData['performances'][performance].cinema == localStorage.chosenCinema) { // if cinema is chosen cinema
      if (stripTimeFromDate(cineworldData['performances'][performance].date) == chosenPerformanceDate) { // if performance date is chosen date

        if ($('#' + cssSafe(performanceTitle)).length == 0) { // add film if not already on page
          performancesList.append(
            $('<li>')
              .attr({ 'id': cssSafe(performanceTitle) })
              .append(
                $('<h2>')
                  .addClass('uk-light uk-background-secondary cin-link cin-padding')
                  .attr({ 'uk-sticky': 'bottom: true;' })
                  .text(performanceTitle)
                  .data({
                    'film-id': cineworldData['performances'][performance].film
                  }),
                $('<ul>')
                  .addClass('cin-performance-times')
              )
          )
        }

        if ($('#' + cssSafe(performanceTitle) + cssSafe(performanceAttributes)).length == 0) {
          $('#' + cssSafe(performanceTitle) + ' > ul').append(
            $('<li>')
              .attr({ 'id': cssSafe(performanceTitle) + cssSafe(performanceAttributes) })
              .append(
                $('<h3>')
                  .addClass('uk-margin-top uk-margin-small-bottom uk-light')
                  .text(performanceAttributes),
                $('<ul>')
              )
          )
        }

        $('#' + cssSafe(performanceTitle) + cssSafe(performanceAttributes) + ' ul').append(
          $('<li>')
            .text(new Date(cineworldData['performances'][performance].date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
            .data({ 'performance-id': performance })
            .addClass('uk-button uk-margin-small-right uk-margin-small-bottom ' +
            (within30Minutes(cineworldData['performances'][performance].date) ? 'uk-button-danger uk-disabled' : 'uk-button-primary'))
        );
      }
    }
  }

  $('#data > li').sort(sortList).appendTo('#data');
}

function renderDays() {
  var daysList = $('#days').empty();

  var performanceDays = [];

  for (performance in cineworldData['performances']) {
    var performanceDate = stripTimeFromDate(cineworldData['performances'][performance].date);

    if (performanceDate >= todaysDate) { // only show today and days in the future
      if (cineworldData['performances'][performance].cinema == localStorage.chosenCinema) { // only show performances from selected cinema
        if (!performanceDays.includes(performanceDate)) {
          performanceDays.push(performanceDate);
        }
      }
    }
  }

  performanceDays.sort();

  for (performanceDay in performanceDays) {
    var performanceDate = stripTimeFromDate(performanceDays[performanceDay]);
    var tomorrowsDate = stripTimeFromDate(new Date().setDate(new Date().getDate() + 1));

    var dayText;

    if (performanceDate == todaysDate) {
      dayText = 'Today';
    } else if (performanceDate == tomorrowsDate) {
      dayText = 'Tomorrow';
    } else {
      dayText = new Date(performanceDays[performanceDay]).toLocaleDateString([], {weekday: 'short'});
    }

    daysList.append(
      $('<li>')
        .addClass((performanceDate == chosenPerformanceDate) ? 'uk-active' : '')
        .append(
          $('<a>')
            .attr({
              'href': '#'
            })
            .text(dayText)
            .data({
              'date': performanceDays[performanceDay]
            })
        )
    );
  }
}

function renderFilmDetails(filmId) {
  $('#film-poster').css({ 'background-image': 'url(' + cineworldData['films'][filmId].posterUrl + ')'});
  $('#film-title').text(cineworldData['films'][filmId].title);
  $('#film-running-time').text('Running time: ' + cineworldData['films'][filmId].runningTime + ' minutes');
  $('#film-release-date').text('Released: ' +
    new Date(cineworldData['films'][filmId].releaseDate).toLocaleDateString([], {day: '2-digit', month: 'long', year: '2-digit'})
  );
  $('#film-synopsis').text(cineworldData['films'][filmId].synopsis);
  $('#film-cast').text('Cast: ' + cineworldData['films'][filmId].cast)
  UIkit.modal($('#modal-full')).show();
}
