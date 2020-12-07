import * as ui from '../../node_modules/@dcl/ui-utils/index'
import { BarStyles } from '../../node_modules/@dcl/ui-utils/index'

//export const uiFireDelay = new ui.UIBar(1)

class uiFireAnimation {
    private uiFireDelay = new ui.UIBar(1, 170, -30, Color4.Red(), BarStyles.ROUNDBLACK, 1)
    private conrnerLabel = new ui.CornerLabel('laser ready', 185, -20, Color4.White(), 16)

    private fireAct: boolean = false
    private timeCount: number = 0
    private _TIMERELOAD = 2

    constructor() {
        this.uiFireDelay.bar.parent.hAlign = 'left'
        this.uiFireDelay.bar.parent.vAlign = 'top'
        this.conrnerLabel.uiText.hAlign = 'left'
        this.conrnerLabel.uiText.vAlign = 'top'
    }
    show() {
        this.uiFireDelay.show()
        this.conrnerLabel.uiText.visible = true
    }
    hide() {
        this.uiFireDelay.hide()
        this.conrnerLabel.uiText.visible = false
    }
    fire() {
        this.fireAct = true
    }
    update(dt: number) {
        if (this.timeCount > this._TIMERELOAD) {
            this.fireAct = false
            this.timeCount = 0
        }

        if (this.fireAct) {
            this.timeCount += dt

            this.uiFireDelay.set(this.timeCount/this._TIMERELOAD)
        }
    }
}

export const uiFireSys = new uiFireAnimation()
engine.addSystem(uiFireSys)