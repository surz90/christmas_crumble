import { GameRectUI } from "./rectModule"

export class GameImageUI {
    rect: GameRectUI
    uiImage: UIImage

    constructor(
        rect: GameRectUI,
        textureImg: Texture,
        sourceLeft: number,
        sourceTop: number,
        sourceWidth: number,
        sourceHeight: number,
        width: number,
        height: number,
        positionX: number,
        positionY: number,
        hAlign: string = 'left',
        vAlign: string = 'top'
    ) {

        this.rect = rect
        this.uiImage = new UIImage(this.rect.rect, textureImg)
        this.uiImage.name = ''
        this.uiImage.hAlign = hAlign
        this.uiImage.vAlign = vAlign
        this.uiImage.sourceLeft = sourceLeft
        this.uiImage.sourceTop = sourceTop
        this.uiImage.sourceWidth = sourceWidth
        this.uiImage.sourceHeight = sourceHeight
        this.uiImage.width = width
        this.uiImage.height = height
        this.uiImage.positionX = positionX
        this.uiImage.positionY = positionY

        this.uiImage.isPointerBlocker = false
    }
    show() {
        this.uiImage.visible = true
    }
    hide() {
        this.uiImage.visible = false
    }
    changePos(_x, _y) {
        this.uiImage.positionX = _x
        this.uiImage.positionY = _y
    }
}

