import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import UIResources from "../resources/UIResources"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"


class TitleUI {
    private canvas: UICanvas
    private titleRect: GameRectUI
    private titleImg: GameImageUI
    
    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()
    }
    loadUI() {
        this.titleRect = new GameRectUI(this.canvas, 1, Color4.Clear(), 0, 0, 493, 105, 'top', 'center')
        this.titleRect.hide()

        this.titleImg = new GameImageUI(
            this.titleRect, UIResources.texture3,
            0, 0, 493, 105, 493, 105, 0, 0, 'center', 'top'
        )
        this.titleImg.hide()
    }
    show() {
        this.titleRect.show()
        this.titleImg.show()
    }
    hide() {
        this.titleRect.hide()
        this.titleImg.hide()
    }
}

export let gameTitleUI = new TitleUI(canvas)