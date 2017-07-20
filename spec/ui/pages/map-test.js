var selenium = require('selenium-webdriver');
var validateURL = require('../utilities');

function churchTest(target) {
  describe('Page specific tests: map.html', function() {
    // Open the site before each test
    beforeEach(function(done) {
      this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();

      this.driver.get(target).then(done);

    });

    // Close the website after each test
    afterEach(function(done) {
      this.driver.quit().then(done);
    });

    it('Validate a marker', function(done) {
      this.driver.sleep(15000); // loading map data is crazy slow

      const zoomInBtn = this.driver.findElement(selenium.By.css('.leaflet-control-zoom-in'));
      for (var i = 0; i < 4; i++) { // zoom in so some markers gets visible
        this.driver.sleep(500); // clicks can happen to fast
        zoomInBtn.click();
      }

      /* 
      * First select all marker available in the DOM
      * Then loop through them and click on the first visible one
      * (there is no API to check if its visible there for the try/catch block)
      */
      this.driver.findElements(selenium.By.css('.leaflet-marker-icon')).then(renderedMarkers => {
        renderedMarkers.forEach(marker => {
            marker.click().then(() => {
              this.driver.findElement(selenium.By.css('.leaflet-popup-content a')).then(elm => {
                elm.click().then(() => {
                  this.driver.getCurrentUrl().then((url) => {
                    expect(url).toContain('/church.html?church=');
                  }).then(() => {
                    done();
                  });
                });
              });
            }).catch(e => {
              return;
            });
        });
      });

    }, 30000);

  });
}

module.exports = churchTest;
