import autoMatch from "../../src/static/game";
import createStyle from "../../src/static/game";
import createRoomsList from "../../src/static/game";
import createChat from "../../src/static/game";
import clearMain from "../../src/static/game";
import handleOrientation from "../../src/static/game";
import mousemove from "../../src/static/game";
import onWindowResize from "../../src/static/game";
import createCamera from "../../src/static/game";
import createLights from "../../src/static/game";
import createRenderer from "../../src/static/game";
import loadMods from "../../src/static/game";
import update from "../../src/static/game";
import render from "../../src/static/game";
import init from "../../src/static/game";

const eXpect = require("chai");

describe("Game test", () => {
    describe("Check autoMatch test", () => {
        it("should return a string confirming automatch", () => {
            var autoMatchCheck = autoMatch();
            console.log(autoMatch);

            eXpect(autoMatchCheck).to.equal("auto matchmaking player")



        })


    })
    
})