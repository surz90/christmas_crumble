import * as ui from '../../node_modules/@dcl/ui-utils/index'
import { BarStyles } from '../../node_modules/@dcl/ui-utils/index'

//export const uiFireDelay = new ui.UIBar(1)

class UIRandomDestroy {
    private randomDesBar = new ui.UIBar(1, 170, -70, Color4.Purple(), BarStyles.ROUNDBLACK, 1)
    private conrnerLabel = new ui.CornerLabel('beam incoming', 185, -60, Color4.White(), 16)

    private fireAct: boolean = false
    private timeCount: number = 0
    private _TIMERELOAD = 20

    constructor() {
        this.randomDesBar.bar.parent.hAlign = 'left'
        this.randomDesBar.bar.parent.vAlign = 'top'

        this.conrnerLabel.uiText.hAlign = 'left'
        this.conrnerLabel.uiText.vAlign = 'top'
    }
    show() {
        this.randomDesBar.show()
        this.conrnerLabel.uiText.visible = true
    }
    hide() {
        this.randomDesBar.hide()
        this.conrnerLabel.uiText.visible = false
    }
    fire() {
        this.timeCount = 0
        this.fireAct = true
    }
    update(dt: number) {
        if (this.timeCount > this._TIMERELOAD) {
            this.fireAct = false
            this.timeCount = 0
        }

        if (this.fireAct) {
            this.timeCount += dt

            this.randomDesBar.set(this.timeCount / this._TIMERELOAD)
        }
    }
}

export const uiRandomDestroySys = new UIRandomDestroy()
engine.addSystem(uiRandomDestroySys)