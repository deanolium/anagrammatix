"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["open"] = 0] = "open";
    GameState[GameState["started"] = 1] = "started";
    GameState[GameState["inRound"] = 2] = "inRound";
    GameState[GameState["scoring"] = 3] = "scoring";
    GameState[GameState["complete"] = 4] = "complete";
})(GameState = exports.GameState || (exports.GameState = {}));
