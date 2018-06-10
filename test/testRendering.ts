import * as mocha from 'mocha';
import * as chai from 'chai';
import { RenderRouter } from '../src/routes/RenderRouter';
import { templateData } from '../src/models/Interfaces';
import * as fs from 'fs-extra';

const expect = chai.expect;

describe('Render template', () => {
  const templateContent: string = '<html><head><title> Planning Certificate {{ certificant }} </title><style>html {text-align: center;font-size: 1.5em;font-family: \'Computer Modern\', \'Roman\', sans-serif;}p {padding: 3%}</style></head><body><h1> Planning Certificate</h1><p>Hereby we grant the certificate of planning competence in the class</p><p><b> {{ additionalInputs.certificationClass }} </b></p><p> to the talented planner </p><p><b><u> {{ certificant }} </u></b></p><p> This certificate has been granted by {{ certifier }} at {{ certificationPlace }} - {{ certificationDate }}.</p><p> {{ laudatio }}</p></body></html>';
  const taskData: templateData = {
    templateId: 'a0e5211c-9835-4836-bda7-44ab4b3ced01',
    certifier: 'Someone',
    certificant: 'Another One',
    laudatio: 'Plant erfolgreich',
    certificationDate: new Date(),
    certificationPlace: 'Here',
    additionalInputs: {
      certificationClass: 'BER',
    },
  };
  const taskId: string = 'b097104b-d0f6-4474-be48-211a6a8c0a33';

  it('should successfully render', () => {
    const renderRouter = new RenderRouter();
    renderRouter.init();
    return renderRouter.renderCertificate(templateContent, taskData, taskId).then((retCode) => {
      expect(retCode).to.equal(200);
      expect(fs.existsSync('/tmp/' + taskId)).to.be.true;
    });
  });
});
