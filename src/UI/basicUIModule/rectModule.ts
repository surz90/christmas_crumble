export class GameRectUI {
    canvas: UICanvas | UIContainerRect
    rect: UIContainerRect

    constructor(canvas, opac: number, color: Color4, posX, posY, width, height, vAlign, hAlign) {
        this.canvas = canvas
        this.rect = new UIContainerRect(this.canvas)
        this.rect.positionX = posX
        this.rect.positionY = posY
        this.rect.height = height
        this.rect.width = width
        this.rect.color = color
        this.rect.hAlign = hAlign
        this.rect.vAlign = vAlign
        this.rect.opacity = opac
        this.rect.visible = false
        this.rect.adaptWidth = true
        this.rect.adaptHeight = true
        this.rect.isPointerBlocker = false
    }
    show() {
        this.rect.visible = true
    }
    hide() {
        this.rect.visible = false
    }
}