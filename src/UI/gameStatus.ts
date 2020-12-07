import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import UIResources from "../resources/UIResources"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"
import { GameTextUI } from "./basicUIModule/textModule"
import { movePlayerTo } from '@decentraland/RestrictedActions'


class GameStatusUI {
    private canvas: UICanvas
    private gameStatusRect: GameRectUI
    //private gameStatusImg: GameImageUI
    private gameStatusTxt: GameTextUI

    private spectateBtnRect: GameRectUI
    private spectateBtn: GameImageUI

    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()
    }
    loadUI() {
        this.gameStatusRect = new GameRectUI(this.canvas, 0.6, Color4.Black(), 10, -40, 301 * 0.65, 30, 'center', 'left')
        this.gameStatusRect.rect.isPointerBlocker = false
        this.gameStatusRect.show()

        this.gameStatusTxt = new GameTextUI(this.gameStatusRect, 'Waiting player to JOIN', Color4.Yellow(), 14, 5, 0, 'left', 'center')

        this.spectateBtnRect = new GameRectUI(this.canvas, 0.8, Color4.Clear(), 210, -40, 100, 30, 'center', 'left')
        this.spectateBtnRect.rect.isPointerBlocker = true
        this.spectateBtnRect.hide()

        this.spectateBtn = new GameImageUI(
            this.spectateBtnRect, UIResources.texture1,
            200, 218, 100, 27, 100, 30, 0, 0, 'left', 'top'
        )
        this.spectateBtn.uiImage.isPointerBlocker = true
        this.spectateBtn.hide()

        this.spectateBtn.uiImage.onClick = new OnClick(() => {
            movePlayerTo(new Vector3(24, 12, 24))
        })
    }
    setText(_newText: string) {
        this.gameStatusTxt.changeText(_newText)
    }
    showSpectateBtn() {
        this.spectateBtnRect.show()
        this.spectateBtn.show()
    }
    hideSpectateBtn() {
        this.spectateBtnRect.hide()
        this.spectateBtn.hide()
    }
}

export let gameStatusUI = new GameStatusUI(canvas)