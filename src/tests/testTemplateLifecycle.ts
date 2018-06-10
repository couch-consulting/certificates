import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import App from '../App';

chai.use(chaiHttp);
const expect = chai.expect;
let testTemplateId: string;
const testTemplate = {
  name: 'TestTemplate',
  description: 'This is just a test',
  inputFields: [],
  previewHTML: '<html><head><title>TestTemplate</title></head><body>This is just a test. Nothing to see here</body></html>',
  previewImage: 'string (binary)',
};

describe('Validate Routers', () => {
  // Delete the test template once all tests are finished
  after((done) => {
    describe('Final Cleanup', () => {
      it('Should remove the test template', () => {
        return chai.request(App).del('/management/' + testTemplateId).then((res) => {
          expect(res.status).to.equal(200);
        });
      });
    });
    done();
  });

  it('Greeting should be json of "hello world"', () => {
    return chai.request(App).get('/').then((res) => {
      expect(res.type).to.equal('application/json');
      expect(res.body).to.deep.equal({ message:'Hello World!' });
    });
  });
  describe('Create a test template', () => {
    it('Should create a new test template', () => {
      return chai.request(App).post('/management').send(testTemplate).then((res) => {
        expect(res.type).to.equal('application/json');
        expect(res.body).to.be.an('object');
        testTemplateId = res.body.templateId;
      });
    });
    it('Should update the test template', () => {
      testTemplate.name = 'UpdatedTestTemplate';
      return chai.request(App).put('/management/' + testTemplateId).send(testTemplate).then((res) => {
        expect(res.status).to.equal(200);
      });
    });
  });
  describe('Retrieve template data', () => {
    it('Should return a list of templates in admin view', () => {
      return chai.request(App).get('/management').then((res) => {
        expect(res.type).to.equal('application/json');
        expect(res.body).to.be.an('array');
      });
    });
    it('Should return a list of templates', () => {
      return chai.request(App).get('/templates').then((res) => {
        expect(res.type).to.equal('application/json');
        expect(res.body).to.be.an('array');
      });
    });
    it('Should retrieve the test template in admin view', () => {
      return chai.request(App).get('/management/' + testTemplateId).then((res) => {
        expect(res.type).to.equal('application/json');
        expect(res.body.executions).to.not.be.undefined;
      });
    });
    it('Should retrieve the test template in user view', () => {
      return chai.request(App).get('/templates/' + testTemplateId).then((res) => {
        expect(res.type).to.equal('application/json');
        expect(res.body.name).to.equal(testTemplate.name);
      });
    });
  });
});
