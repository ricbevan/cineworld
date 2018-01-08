function getDataFromCineWorld() {

  $.ajax({
    url: 'https://www.cineworld.co.uk/syndication/weekly_film_times.xml',
    async: true,
    dataType: "xml",
    success: function (cineWorldXml) {

      // attributes are a different layout to others, so handle this separately
      $(cineWorldXml).find('feed > attributes').children().each(function() {
        cineworldData['attributes'][$(this).attr('code')] = $(this).text();
      });

      // some of the descriptions aren't great, so manually replace them
      cineworldData['attributes']['AD'] = 'Audio Description';
      cineworldData['attributes']['ViP'] = 'VIP';
      cineworldData['attributes']['ST'] = 'Subtitled';
      cineworldData['attributes']['AC'] = 'Alternative Content';
      cineworldData['attributes']['M4J'] = 'Movies for Juniors';
      cineworldData['attributes']['AUT'] = 'Autism Friendly';
      cineworldData['attributes']['PRE'] = 'Unlimited Screening';

      $(cineWorldXml).find('feed > cinemas, feed > films, feed > performances').each(function() {

        var group = {}; // cinemas, films or performances

        $(this).children().each(function(index) {

          var item = {}; // cinema, film or performance

          $(this).children().each(function() { // get each item attribute
            if ($(this)[0].nodeName == 'attributes') { // store attributes in an array
              item[$(this)[0].nodeName] = $(this).text().split(',');
            } else {
              item[$(this)[0].nodeName] = $(this).text();
            }
          });

          var key;

          if (typeof($(this).attr('id')) !== 'undefined') {
            key = $(this).attr('id');
          } else { // performances don't have an id, so we'll use an index - also store cinema and film
            key = index;
            item['cinema'] = $(this).attr('cinema');
            item['film'] = $(this).attr('film');
          }

          group[key] = item;

        });

        cineworldData[$(this)[0].nodeName] = group;
      });

      // cineworldData['lastUpdated'] = new Date().toString();
      // localStorage.cineworldData = JSON.stringify(cineworldData);

      renderPage();
    }
  });
}
