import { GameRectUI } from "./rectModule"

export class GameTextUI {
    rect: any
    uiText: UIText
    textVal: string
    counterTurn: number
    numberStep: number

    constructor(
        rect: any,
        textValue: string,
        color: Color4,
        fontsize: number,
        positionX: number,
        positionY: number,
        hAlign: string = 'center',
        vAlign: string = 'center'
    ) {
        this.counterTurn = 0
        this.numberStep = 0
        this.rect = rect

        this.uiText = new UIText(this.rect.rect)
        this.uiText.value = textValue
        this.uiText.color = color
        this.uiText.fontSize = fontsize
        this.uiText.positionX = positionX
        this.uiText.positionY = positionY
        this.uiText.adaptHeight = true
        this.uiText.adaptWidth = true
        this.uiText.hAlign = hAlign
        this.uiText.vAlign = vAlign
        this.uiText.hTextAlign = 'center'
        this.uiText.vTextAlign = 'center'
        this.uiText.textWrapping = false
        this.textVal = textValue

        this.uiText.isPointerBlocker = false
    }

    show() {
        this.uiText.visible = true
    }
    hide() {
        this.uiText.visible = false
    }
    changeText(textNewValue, textsize = this.uiText.fontSize) {
        this.uiText.value = textNewValue
        this.uiText.fontSize = textsize
    }
    resetText() {
        this.numberStep = 0
        this.counterTurn = 0
        this.textVal = ''
        this.uiText.value = ''
    }
    changeColor(color: Color4) {
        this.uiText.color = color
    }
}