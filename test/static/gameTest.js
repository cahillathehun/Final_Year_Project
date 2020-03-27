//import sinon from './node_modules/sinon/pkg/sinon-esm.js'

const sinon = require("sinon").createSandbox();
// const referee = require("@sinonjs/referee");
// const assert = sinon.assert();
// const mousemove = require();
// const PubSub = require("pubsub-js"); // this is a library to use pub/sub "messaging" methods
// const mousemove = new mou

// Setup for test
const fakeXY ={
  'X': 42,
  'Y': 42
}

// Tests

describe("Wrap around mousemove, can add more methods and change describe to wrap around methods", function() {
  

  beforeEach(function() {
    sinon.stub(fakeXY, 'X').value(40);
    sinon.stub(fakeXY, 'Y').value(40);
    var spyX = sinon.spy(fakeXY, 'X');
    var spyY = sinon.spy(fakeXY, 'Y');
  });

  afterEach(function() {
    console.log("Pre restore:")
    console.log(fakeXY.X);
    console.log(fakeXY.Y);
    sinon.restore();
    try{
      spyX.restore();
      spyY.restor(); // sinon.restore() would probably handle it but these are included just to be sure.
    }
    catch(error) { console.log("Alt Spy restore failed as regular restore succeeded")}
    console.log("Post restore:")
    console.log(fakeXY.X);
    console.log(fakeXY.Y);
  });

  it("should track mouse move X and Y, output should equate input for this test", function() {
    const callbackSpy = sinon.spy();

    PubSub.subscribe("", callbackSpy);
    PubSub.publishSync("");
    sinon.assert.called(fakeXY.X);
    console.log("So the test got to this point!")


    


  });
});