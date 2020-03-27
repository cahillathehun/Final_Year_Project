import {mousemove} from '../src/static/game.js'

//import sinon from './node_modules/sinon/pkg/sinon-esm.js'

const sinon = require("sinon").createSandbox();
var chai = require('chai');
var assert = chai.assert
const jQuery = require("jquery");
// const referee = require("@sinonjs/referee");
// const assert = sinon.assert();

// const PubSub = require("pubsub-js"); // this is a library to use pub/sub "messaging" methods (testing server maybe)

// Setup for test
const fakeXY ={
  'X': 42,
  'Y': 42
}

// Tests

describe("Wrap around mousemove", function() {
  

  beforeEach(function() {
    // sinon.stub(fakeXY, 'X').value(40);
    // sinon.stub(fakeXY, 'Y').value(40);
    // var spyX = sinon.spy(fakeXY, 'X');
    // var spyY = sinon.spy(fakeXY, 'Y');
  });

  afterEach(function() {
    console.log("Pre restore:")
    console.log(fakeXY.X);
    console.log(fakeXY.Y);
    sinon.restore();
    try{
      spyX.restore();
      spyY.restore(); // sinon.restore() would probably handle it but these are included just to be sure.
    }
    catch(error) { console.log("Alt Spy restore failed as regular restore succeeded")}
    console.log("Post restore:")
    console.log(fakeXY.X);
    console.log(fakeXY.Y);
  });

  it("should track mouse move X and Y, checking for event trigger", function(done) {
    // const callbackSpy = sinon.spy();
    var eventSpu = sinon.spy();
    setTimeout(function () {
      assert(eventSpu.called, 'Event did not fire in 1000ms.');
      assert(eventSpu.calledOnce, 'Event fired more tha once.');
      done();
    }, 1000);
    // PubSub.subscribe("", callbackSpy);
    // PubSub.publishSync("");
    // sinon.assert.called(fakeXY.X);
    console.log("So the test got to this point!")
    mousemove.on('some_event', function() {
      var mouseEvent = jQuery.Event('mousemove');
      mouseEvent.pageX = 40;
      mouseEvent.pageY = 40;
      jQuery(document).trigger(mouseEvent);
    });


    


  });
});