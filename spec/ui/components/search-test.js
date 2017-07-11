var selenium = require('selenium-webdriver');

// target = url of the page to test
function searchTest(target, page) {
  function preformSerach(self, search) {
    var searchBox = self.driver.findElement(selenium.By.id('search-box'));
    var resultsContainer = self.driver.findElement(selenium.By.id('results'));
    var loadingScreen = self.driver.findElement(selenium.By.id('loading-screen'));

    // on the church/map page the loading element is used while the actual page is rendering,
    // therefor if the search test starts before the rendering is done it breaks.
    if (target.includes('church.html') || target.includes('map.html')) {
      // this should be less then 2, if timeout errors is a issue, you should setup a local instance of the API (https://github.com/kyrkosok/api).
      self.driver.sleep(3000);
    }

    // trigger search
    searchBox.sendKeys(search);
    searchBox.sendKeys(selenium.Key.ENTER);

    // low but existing timeout value for things that should be triggered directly after the last resolved Promise
    self.driver.wait(selenium.until.elementIsVisible(loadingScreen), 50).then(() => {
      self.driver.wait(selenium.until.elementIsNotVisible(loadingScreen)).then(() => {
        self.driver.wait(selenium.until.elementIsVisible(resultsContainer), 50).catch(() => {
            fail('The results are never rendered.');
          });
      }).catch(() => {
          fail('Loading screen continues for to long.');
        }
      );
    }).catch(() => {
        fail('Loading screen not rendered after triggered search.');
      }
    );
  }

  describe('Search Component Tests at ' + page, function() {
    // Open the site before each test
    beforeEach(function(done) {
      this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();

      this.driver.get(target).then(done);
    });

    // Close the website after each test
    afterEach(function(done) {
      this.driver.quit().then(done);
    });

    it('Test basic successful search', function(done) {
      preformSerach(this, 'floda');

      this.driver.findElements(selenium.By.css('.search-results ul li a')).then(value => {
        expect(value.length).toBeGreaterThan(0); // items exist
        return value[0];
      }).then((elm) => {
        elm.click();
        this.driver.getCurrentUrl().then((url) => {
          expect(url).toContain('/church.html?church=')
        });
      }).finally(() => {
        done();
      });

    }, 30000);

    it('Test basic unsuccessful search', function(done) {
      preformSerach(this, 'results is no where to be found')

      this.driver.findElement(selenium.By.css('.not-found button')).then(elm => {
        elm.click();
        var resultsContainer = this.driver.findElement(selenium.By.id('results'));
        this.driver.wait(selenium.until.elementIsNotVisible(resultsContainer), 50).catch((e) => {
            fail('"No results"(OK) button failed to close the results');
        });

      }).finally(() => {
        done();
      });

    }, 30000);
  });
}

module.exports = searchTest;
