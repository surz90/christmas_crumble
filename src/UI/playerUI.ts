import { canvas } from "../../node_modules/@dcl/ui-utils/index"
import { userName } from "../game"
import { RoleType, TeamType } from "../gameType"
import soundResources from "../resources/soundResources"
import UIResources from "../resources/UIResources"
import { ClientMethod, WSSHandler } from "../wssHandler"
import { GameImageUI } from "./basicUIModule/imageModule"
import { GameRectUI } from "./basicUIModule/rectModule"
import { GameTextUI } from "./basicUIModule/textModule"

export class PlayerUI {
    private canvas: UICanvas
    private playerUIRect: GameRectUI
    private playerUIBg: GameImageUI


    private santaATT1Btn: GameImageUI
    private santaATT2Btn: GameImageUI
    private santaDEFBtn: GameImageUI

    private santaATT1Text: GameTextUI
    private santaATT2Text: GameTextUI
    private santaDEFText: GameTextUI

    private santaATT1Die: GameImageUI
    private santaATT2Die: GameImageUI
    private santaDEFDie: GameImageUI


    private krampusATT1Btn: GameImageUI
    private krampusATT2Btn: GameImageUI
    private krampusDEFBtn: GameImageUI

    private krampusATT1Text: GameTextUI
    private krampusATT2Text: GameTextUI
    private krampusDEFText: GameTextUI

    private krampusATT1Die: GameImageUI
    private krampusATT2Die: GameImageUI
    private krampusDEFDie: GameImageUI

    constructor(canvas) {
        this.canvas = canvas
        this.loadUI()
    }
    private loadUI() {
        this.playerUIRect = new GameRectUI(this.canvas, 1, Color4.Clear(), 10, 90, 301, 212, 'center', 'left')
        this.playerUIRect.rect.isPointerBlocker = true
        this.playerUIRect.show()

        this.playerUIBg = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 0, 0, 301, 212, 301, 212, 0, 0, 'left', 'top'
        )
        this.playerUIBg.uiImage.isPointerBlocker = true

        //button
        this.santaATT1Btn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 0, 249, 78, 27, 78, 27, 30, -68, 'left', 'top'
        )
        this.santaATT1Btn.uiImage.isPointerBlocker = true

        this.santaATT2Btn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 0, 249, 78, 27, 78, 27, 30, -121, 'left', 'top'
        )
        this.santaATT2Btn.uiImage.isPointerBlocker = true

        this.santaDEFBtn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 0, 249, 78, 27, 78, 27, 30, -173, 'left', 'top'
        )
        this.santaDEFBtn.uiImage.isPointerBlocker = true


        this.krampusATT1Btn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 90, 249, 78, 27, 78, 27, -30, -68, 'right', 'top'
        )
        this.krampusATT1Btn.uiImage.isPointerBlocker = true

        this.krampusATT2Btn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 90, 249, 78, 27, 78, 27, -30, -121, 'right', 'top'
        )
        this.krampusATT2Btn.uiImage.isPointerBlocker = true

        this.krampusDEFBtn = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 90, 249, 78, 27, 78, 27, -30, -173, 'right', 'top'
        )
        this.krampusDEFBtn.uiImage.isPointerBlocker = true


        //text
        this.santaATT1Text = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, 10, -68, 'left', 'top')
        this.santaATT2Text = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, 10, -121, 'left', 'top')
        this.santaDEFText = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, 10, -173, 'left', 'top')

        this.krampusATT1Text = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, -10, -68, 'right', 'top')
        this.krampusATT2Text = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, -10, -121, 'right', 'top')
        this.krampusDEFText = new GameTextUI(this.playerUIRect, '---', Color4.Black(), 30, -10, -173, 'right', 'top')

        this.santaATT1Text.hide()
        this.santaATT2Text.hide()
        this.santaDEFText.hide()
        this.krampusATT1Text.hide()
        this.krampusATT2Text.hide()
        this.krampusDEFText.hide()

        //player die
        this.santaATT1Die = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, 6, -64, 'left', 'top'
        )
        this.santaATT2Die = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, 6, -117, 'left', 'top'
        )
        this.santaDEFDie = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, 6, -168, 'left', 'top'
        )

        this.krampusATT1Die = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, -6, -64, 'right', 'top'
        )
        this.krampusATT2Die = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, -6, -117, 'right', 'top'
        )
        this.krampusDEFDie = new GameImageUI(
            this.playerUIRect, UIResources.texture1, 1, 279, 130, 35, 130, 35, -6, -168, 'right', 'top'
        )

        this.santaATT1Die.hide()
        this.santaATT2Die.hide()
        this.santaDEFDie.hide()
        this.krampusATT1Die.hide()
        this.krampusATT2Die.hide()
        this.krampusDEFDie.hide()

        //on click
        this.santaATT1Btn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join santa att1', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.SANTA,
                    role: RoleType.ATT1
                }
            })
        })
        this.santaATT2Btn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join santa att2', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.SANTA,
                    role: RoleType.ATT2
                }
            })
        })
        this.santaDEFBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join santa def', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.SANTA,
                    role: RoleType.DEF
                }
            })
        })

        this.krampusATT1Btn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join krampus att1', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.KRAMPUS,
                    role: RoleType.ATT1
                }
            })
        })
        this.krampusATT2Btn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join krampus att2', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.KRAMPUS,
                    role: RoleType.ATT2
                }
            })
        })
        this.krampusDEFBtn.uiImage.onClick = new OnClick(() => {
            soundResources.click.getComponent(AudioSource).playOnce()
            log('join krampus def', userName)
            WSSHandler.sendMsg({
                method: ClientMethod.JOIN,
                data: {
                    dclID: userName,
                    team: TeamType.KRAMPUS,
                    role: RoleType.DEF
                }
            })
        })
    }

    setPlayerUI(data: any) {
        //santa data
        if (data.SANTA.ATT1.dclID !== '') {
            this.santaATT1Text.changeText(data.SANTA.ATT1.dclID, 15)
            this.santaATT1Text.show()
            this.santaATT1Die.hide()
            this.santaATT1Btn.hide()
        }
        else {
            this.santaATT1Text.hide()
            if (data.SANTA.ATT1.enable) {
                this.santaATT1Die.hide()
                this.santaATT1Btn.show()
            }
            else this.santaATT1Die.show()
        }

        if (data.SANTA.ATT2.dclID !== '') {
            this.santaATT2Text.changeText(data.SANTA.ATT2.dclID, 15)
            this.santaATT2Text.show()
            this.santaATT2Die.hide()
            this.santaATT2Btn.hide()
        }
        else {
            this.santaATT2Text.hide()
            if (data.SANTA.ATT2.enable) {
                this.santaATT2Die.hide()
                this.santaATT2Btn.show()
            }
            else this.santaATT2Die.show()
        }

        if (data.SANTA.DEF.dclID !== '') {
            this.santaDEFText.changeText(data.SANTA.DEF.dclID, 15)
            this.santaDEFText.show()
            this.santaDEFDie.hide()
            this.santaDEFBtn.hide()
        }
        else {
            this.santaDEFText.hide()
            if (data.SANTA.DEF.enable) {
                this.santaDEFBtn.show()
                this.santaDEFDie.hide()
            }
            else this.santaDEFDie.show()
        }

        //krampus data
        if (data.KRAMPUS.ATT1.dclID !== '') {
            this.krampusATT1Text.changeText(data.KRAMPUS.ATT1.dclID, 15)
            this.krampusATT1Text.show()
            this.krampusATT1Die.hide()
            this.krampusATT1Btn.hide()
        }
        else {
            this.krampusATT1Text.hide()
            if (data.KRAMPUS.ATT1.enable) {
                this.krampusATT1Btn.show()
                this.krampusATT1Die.hide()
            }
            else this.krampusATT1Die.show()
        }

        if (data.KRAMPUS.ATT2.dclID !== '') {
            this.krampusATT2Text.changeText(data.KRAMPUS.ATT2.dclID, 15)
            this.krampusATT2Text.show()
            this.krampusATT2Die.hide()
            this.krampusATT2Btn.hide()
        }
        else {
            this.krampusATT2Text.hide()
            if (data.KRAMPUS.ATT2.enable) {
                this.krampusATT2Btn.show()
                this.krampusATT2Die.hide()
            }
            else this.krampusATT2Die.show()
        }

        if (data.KRAMPUS.DEF.dclID !== '') {
            this.krampusDEFText.changeText(data.KRAMPUS.DEF.dclID, 15)
            this.krampusDEFText.show()
            this.krampusDEFDie.hide()
            this.krampusDEFBtn.hide()
        }
        else {
            this.krampusDEFText.hide()
            if (data.KRAMPUS.DEF.enable) {
                this.krampusDEFBtn.show()
                this.krampusDEFDie.hide()
            }
            else this.krampusDEFDie.show()
        }
    }
    changePlayerText(team: TeamType, role: RoleType, dclID: string) {
        if (team === TeamType.SANTA) {
            if (role === RoleType.ATT1) this.santaATT1Text.changeText(dclID, 25)
            else if (role === RoleType.ATT2) this.santaATT2Text.changeText(dclID, 25)
            else if (role === RoleType.DEF) this.santaDEFText.changeText(dclID, 25)
        }
        else if (team === TeamType.KRAMPUS) {
            if (role === RoleType.ATT1) this.krampusATT1Text.changeText(dclID, 25)
            if (role === RoleType.ATT2) this.krampusATT2Text.changeText(dclID,25)
            if (role === RoleType.DEF) this.krampusDEFText.changeText(dclID, 25)
        }
    }
    swHdButton(team: TeamType, role: RoleType, swHd: boolean) {
        let btnTarget: GameImageUI = null

        if (team === TeamType.SANTA) {
            if (role === RoleType.ATT1) btnTarget = this.santaATT1Btn
            else if (role === RoleType.ATT2) btnTarget = this.santaATT2Btn
            else if (role === RoleType.DEF) btnTarget = this.santaDEFBtn
        }
        else if (team === TeamType.KRAMPUS) {
            if (role === RoleType.ATT1) btnTarget = this.krampusATT1Btn
            else if (role === RoleType.ATT2) btnTarget = this.krampusATT2Btn
            else if (role === RoleType.DEF) btnTarget = this.krampusDEFBtn
        }

        if(!btnTarget) return

        if (swHd) btnTarget.show()
        else btnTarget.hide()
    }

    disablePlayer(team: TeamType, role: RoleType) {
        if (team === TeamType.SANTA) {
            if (role === RoleType.ATT1) this.santaATT1Die.show()
            if (role === RoleType.ATT2) this.santaATT2Die.show()
            if (role === RoleType.DEF) this.santaDEFDie.show()
        }
        if (team === TeamType.KRAMPUS) {
            if (role === RoleType.ATT1) this.krampusATT1Die.show()
            if (role === RoleType.ATT2) this.krampusATT2Die.show()
            if (role === RoleType.DEF) this.krampusDEFDie.show()
        }
    }
}

export const playerUI = new PlayerUI(canvas)
/*
testUI.swHdButton(TeamType.SANTA, RoleType.ATT1, false)
testUI.swHdButton(TeamType.SANTA, RoleType.DEF, false)
*/