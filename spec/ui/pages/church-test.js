var selenium = require('selenium-webdriver');
var validateURL = require('../utilities');

function churchTest(target) {
  describe('Page specific tests: church.html', function() {
    // Open the site before each test
    beforeEach(function(done) {
      this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();

      this.driver.get(target).then(done);

    });

    // Close the website after each test
    afterEach(function(done) {
      this.driver.quit().then(done);
    });

    it('Test Commons image and link', function(done) {
      this.driver.sleep(3000);

      var image = this.driver.findElement(selenium.By.id('church-header'));
      image.getAttribute('src').then(attr => {
        validateURL(attr).then(bool => {
          expect(bool).toBeTruthy();
        }).then(() => {
          var imageAttribution = this.driver.findElement(selenium.By.id('church-commons-link'));
          imageAttribution.getAttribute('href').then(attr => {
            validateURL(attr).then(bool => {
              expect(bool).toBeTruthy();
            }).then(() => {
              done();
            });
          });
        });
      });

    }, 30000);

    it('Test Kringla and BBR links', function(done) {
      this.driver.sleep(3000);

      var kringlaLink = this.driver.findElement(selenium.By.id('church-kringla'));
      var bbrLink = this.driver.findElement(selenium.By.id('church-bbr-link'));
      kringlaLink.getAttribute('href').then(attr => {
        validateURL(attr).then(bool => {
          expect(bool).toBeTruthy();
        }).then(() => {
          bbrLink.getAttribute('href').then(attr => {
            validateURL(attr).then(bool => {
              expect(bool).toBeTruthy();
            }).then(() => {
              done();
            });
          });
        });
      });

    }, 30000);

    it('Test Wikipedia link and summary', function(done) {
      this.driver.sleep(3000);

      var summary = this.driver.findElement(selenium.By.id('church-wikipedia'));
      var wikipediaLink = this.driver.findElement(selenium.By.id('church-wikipedia-link'));
      wikipediaLink.getAttribute('href').then(attr => {
        validateURL(attr).then(bool => {
          expect(bool).toBeTruthy();
        }).then(() => {
          summary.getText().then(text => {
            expect(text.length).toBeGreaterThan(10);
          }).then(() => {
            done();
          });
        });
      });

    }, 30000);

    it('Test page title and h1', function(done) {
      this.driver.sleep(3000);

      var h1 = this.driver.findElement(selenium.By.id('church-title'));
      h1.getText().then(text => {
        expect(text.length).toBeGreaterThan(10);
      }).then(() => {
        this.driver.getTitle().then(title => {
          expect(title.includes('{label}')).toBeFalsy();
        }).then(() => {
          done();
        });
      });

    }, 30000);

    it('Test page title and h1', function(done) {
      this.driver.sleep(3000);

      var h1 = this.driver.findElement(selenium.By.id('church-title'));
      h1.getText().then(text => {
        expect(text.length).toBeGreaterThan(10);
      }).then(() => {
        this.driver.getTitle().then(title => {
          expect(title.includes('{label}')).toBeFalsy();
        }).then(() => {
          done();
        });
      });

    }, 30000);

    it('Test BBR expand btn', function(done) {
      this.driver.sleep(3000);
      
      var bbrText = this.driver.findElement(selenium.By.id('church-bbr'));
      var btn = this.driver.findElement(selenium.By.id('bbr-expand'));
      bbrText.getText().then(text => {
        if (text.length > 0) {
          bbrText.getSize().then(size => {
            var defaultHeight = size.height;
            btn.click();
            bbrText.getSize().then(size => {
              expect(size.height).toBeGreaterThan(defaultHeight);
              btn.click();
              bbrText.getSize().then(size => {
                expect(size.height).toEqual(defaultHeight);
              }).then(() => {
                done();
              });
            });
          });
        }
      });

    }, 30000);
  });
}

module.exports = churchTest;
