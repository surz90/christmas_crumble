import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import { WSSHandler } from "../wssHandler"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"
import { GameTextUI } from "./basicUIModule/textModule"


class GameConnectionUI {
    private canvas: UICanvas
    private gameStatusRect: GameRectUI
    private gameStatusTxt: GameTextUI


    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()
    }
    loadUI() {
        this.gameStatusRect = new GameRectUI(this.canvas, 0.7, Color4.Black(), 10, 0, 480 * 0.6, 20, 'bottom', 'center')
        this.gameStatusRect.rect.isPointerBlocker = false
        this.gameStatusRect.show()

        this.gameStatusTxt = new GameTextUI(this.gameStatusRect, 'connecting to server', Color4.Yellow(), 14, 0, 3, 'center', 'bottom')

    }
    setText(_newText: string, color: Color4) {
        this.gameStatusTxt.changeText(_newText)
        this.gameStatusTxt.uiText.color = color
    }
}

export let gameCOnnectionUI = new GameConnectionUI(canvas)