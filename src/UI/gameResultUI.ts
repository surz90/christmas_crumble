import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import UIResources from "../resources/UIResources"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"
import { TeamType } from "../gameType"


class GameResultUI {
    private canvas: UICanvas

    private gameResultRect: GameRectUI

    private santaWINimg: GameImageUI
    private krampusWINimg: GameImageUI

    private closeBtn: GameImageUI

    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()
    }
    loadUI() {
        this.gameResultRect = new GameRectUI(this.canvas, 1, Color4.Clear(), 0, 0, 400, 115, 'center', 'center')
        this.gameResultRect.rect.isPointerBlocker = true
        this.gameResultRect.hide()

        this.santaWINimg = new GameImageUI(
            this.gameResultRect, UIResources.texture1,
            0, 338, 390, 79, 390, 79, 0, 0, 'center', 'top'
        )
        this.santaWINimg.hide()

        this.krampusWINimg = new GameImageUI(
            this.gameResultRect, UIResources.texture1,
            0, 425, 390, 79, 390, 79, 0, 0, 'center', 'top'
        )
        this.krampusWINimg.hide()

        this.closeBtn = new GameImageUI(
            this.gameResultRect, UIResources.texture1,
            269, 248, 30, 30, 30, 30, 0, 0, 'center', 'bottom'
        )
        this.closeBtn.uiImage.isPointerBlocker = true
        this.closeBtn.hide()

        this.closeBtn.uiImage.onClick = new OnClick(() => {
            this.gameResultRect.hide()
            this.krampusWINimg.hide()
            this.santaWINimg.hide()
        })
    }
    showResult(_team: TeamType) {
        this.gameResultRect.show()
        log('UI RESULT: ', _team, TeamType.SANTA, TeamType.KRAMPUS)
        if (_team === TeamType.SANTA) {
            this.santaWINimg.show()
        }
        else {
            this.krampusWINimg.show()
        }
        this.closeBtn.show()
    }

}

export let gameResultUI = new GameResultUI(canvas)