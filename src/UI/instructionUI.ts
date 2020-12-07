import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import soundResources from "../resources/soundResources"
import UIResources from "../resources/UIResources"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"


class InstructiontUI {
    private canvas: UICanvas

    private mainBtnRect: GameRectUI
    private mainBtn: GameImageUI

    private instructionList: GameImageUI[] = []
    private instructionRect: GameRectUI

    private instruction0: GameImageUI
    private instruction1: GameImageUI
    private instruction2: GameImageUI
    private instruction3: GameImageUI

    private closeBtn: GameImageUI
    private nextBtn: GameImageUI
    private prevBtn: GameImageUI

    private index: number = 0

    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()

        this.instructionList = [
            this.instruction0,
            this.instruction1,
            this.instruction2,
            this.instruction3
        ]
    }
    loadUI() {
        this.mainBtnRect = new GameRectUI(this.canvas, 1, Color4.Clear(), -10, 0, 50, 50, 'bottom', 'right')
        this.mainBtnRect.rect.isPointerBlocker = true
        this.mainBtnRect.show()
        
        this.mainBtn = new GameImageUI(
            this.mainBtnRect, UIResources.texture2,
            12, 454, 46, 46, 45, 45, 0, 0, 'center', 'bottom'
        )
        this.mainBtn.uiImage.isPointerBlocker = true
        this.mainBtn.show()
        

        this.instructionRect = new GameRectUI(this.canvas, 1, Color4.Clear(), -10, 0, 492, 150, 'bottom', 'right')
        this.instructionRect.rect.isPointerBlocker = true
        this.instructionRect.hide()

        this.instruction0 = new GameImageUI(
            this.instructionRect, UIResources.texture2,
            0, 0, 492, 101, 492, 101, 0, 0, 'center', 'top'
        )
        this.instruction0.hide()

        this.instruction1 = new GameImageUI(
            this.instructionRect, UIResources.texture2,
            0, 103, 492, 101, 492, 101, 0, 0, 'center', 'top'
        )
        this.instruction1.hide()

        this.instruction2 = new GameImageUI(
            this.instructionRect, UIResources.texture2,
            0, 206, 492, 101, 492, 101, 0, 0, 'center', 'top'
        )
        this.instruction2.hide()

        this.instruction3 = new GameImageUI(
            this.instructionRect, UIResources.texture2,
            0, 309, 492, 101, 492, 101, 0, 0, 'center', 'top'
        )
        this.instruction3.hide()

        // BUTTON
        this.prevBtn = new GameImageUI(
            this.instructionRect, UIResources.texture1,
            203, 248, 30, 30, 30, 30, -50 + 15, 13, 'center', 'bottom'
        )
        this.prevBtn.uiImage.isPointerBlocker = true
        this.prevBtn.hide()

        this.closeBtn = new GameImageUI(
            this.instructionRect, UIResources.texture1,
            269, 248, 30, 30, 30, 30, 0 + 15, 13, 'center', 'bottom'
        )
        this.closeBtn.uiImage.isPointerBlocker = true
        this.closeBtn.hide()

        this.nextBtn = new GameImageUI(
            this.instructionRect, UIResources.texture1,
            236, 248, 30, 30, 30, 30, 50 + 15, 13, 'center', 'bottom'
        )
        this.nextBtn.uiImage.isPointerBlocker = true
        this.nextBtn.hide()

        //button click
        this.mainBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            this.instructionRect.show()
            this.instructionList[this.index].show()
            this.closeBtn.show()
            this.nextBtn.show()
            this.prevBtn.show()
        })

        this.closeBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            this.instructionRect.hide()
            this.instructionList[this.index].hide()
            this.closeBtn.hide()
            this.nextBtn.hide()
            this.prevBtn.hide()

            this.index = 0
        })
        this.nextBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            if (this.index === this.instructionList.length - 1) return

            this.instructionList[this.index].hide()
            this.index += 1
            this.instructionList[this.index].show()
        })
        this.prevBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            if (this.index === 0) return

            this.instructionList[this.index].hide()
            this.index -= 1
            this.instructionList[this.index].show()
        })
    }
    show() {
        this.mainBtnRect.show()
        this.mainBtn.show()
    }
}

export let gameInstructionUI = new InstructiontUI(canvas)