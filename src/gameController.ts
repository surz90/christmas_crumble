import utils from "../node_modules/decentraland-ecs-utils/index";
import { userName } from "./game";
import { map } from "./gameMap";
import { KrampusTeamType, RoleType, SantaTeamType, TeamType } from "./gameType";
import { Player } from "./player";
import { gameStatusUI } from "./UI/gameStatus";
import { gameEffect } from "./gameEffect";
import { movePlayerTo } from '@decentraland/RestrictedActions'


export class GameController {
    socket: WebSocket = null

    santaTeam: SantaTeamType = {
        ATT1: null,
        ATT2: null,
        DEF: null
    }
    krampusTeam: KrampusTeamType = {
        ATT1: null,
        ATT2: null,
        DEF: null
    }

    isStart: boolean = false
    isEnd: boolean = false

    fallAreaTrigger: Entity

    constructor() {
    }

    initGameLogic(_socket) {
        log('INIT')
        this.socket = _socket
        this.santaTeam.ATT1 = new Player(TeamType.SANTA, RoleType.ATT1, _socket)
        this.santaTeam.ATT2 = new Player(TeamType.SANTA, RoleType.ATT2, _socket)
        this.santaTeam.DEF = new Player(TeamType.SANTA, RoleType.DEF, _socket)

        this.krampusTeam.ATT1 = new Player(TeamType.KRAMPUS, RoleType.ATT1, _socket)
        this.krampusTeam.ATT2 = new Player(TeamType.KRAMPUS, RoleType.ATT2, _socket)
        this.krampusTeam.DEF = new Player(TeamType.KRAMPUS, RoleType.DEF, _socket)


        let triggerBox = new utils.TriggerBoxShape(new Vector3(45, 4.8, 45), new Vector3(24, 4.8 / 2, 24))
        this.fallAreaTrigger = new Entity()
        this.fallAreaTrigger.addComponent(new utils.TriggerComponent(triggerBox, null, null, null, null,
            () => {
                log('player fall')
                let playerTarget: Player
                for (let player in this.santaTeam) {
                    if (this.santaTeam[player] !== null && this.santaTeam[player].dclID === userName) {
                        playerTarget = this.santaTeam[player]
                        break
                    }
                }
                for (let player in this.krampusTeam) {
                    if (this.krampusTeam[player] !== null && this.krampusTeam[player].dclID === userName) {
                        playerTarget = this.krampusTeam[player]
                        break
                    }
                }
                if(playerTarget) playerTarget.fall()
            },
            () => { },
            false
        ))
        this.fallAreaTrigger.getComponent(utils.TriggerComponent).enabled = false
        engine.addEntity(this.fallAreaTrigger)
    }

    startGame() {
        map.moveGameArena()
        let isPlay = false

        for (let key in this.santaTeam) {
            if (this.santaTeam[key].dclID === userName) {
                isPlay = true
                
                if (key === 'ATT1') movePlayerTo(new Vector3(4, 7, 34))
                else if (key === 'ATT2') movePlayerTo(new Vector3(4, 7, 14))
                else if (key === 'DEF') movePlayerTo(new Vector3(9, 7, 19))
                
            }
        }
        for (let key in this.krampusTeam) {
            if (this.krampusTeam[key].dclID === userName) {
                isPlay = true
                
                if (key === 'ATT1') movePlayerTo(new Vector3(44, 7, 34))
                else if (key === 'ATT2') movePlayerTo(new Vector3(44, 7, 14))
                else if (key === 'DEF') movePlayerTo(new Vector3(39, 7, 28))
                
            }
        }

        gameStatusUI.setText('Game Started!')
        if(!isPlay) gameStatusUI.showSpectateBtn()

        let delayStart = new Entity()
        delayStart.addComponent(new utils.Delay(1000, () => {
            this.isStart = true

            for (let key in this.santaTeam) {
                this.santaTeam[key].canFire = true
            }
            for (let key in this.krampusTeam) {
                this.krampusTeam[key].canFire = true
            }
            this.fallAreaTrigger.getComponent(utils.TriggerComponent).enabled = true

            engine.removeEntity(delayStart)
        }))

        engine.addEntity(delayStart)
        //move platform above
    }

    endGame() {
        this.isStart = false
        this.fallAreaTrigger.getComponent(utils.TriggerComponent).enabled = false

        for (let key in this.santaTeam) {
            this.santaTeam[key].canFire = false
        }
        for (let key in this.krampusTeam) {
            this.krampusTeam[key].canFire = false
        }

        map.moveBackArena()

        movePlayerTo(new Vector3(Camera.instance.position.x, 4, Camera.instance.position.z))
    }

    isUserPlaying() {
        for (let key in this.santaTeam) {
            if (this.santaTeam[key] !== null && this.santaTeam[key].dclID === userName) {
                return {
                    team: TeamType.SANTA,
                    role: RoleType[key]
                }
            }
        }
        for (let key in this.krampusTeam) {
            if (this.krampusTeam[key] !== null && this.krampusTeam[key].dclID === userName) {
                return {
                    team: TeamType.KRAMPUS,
                    role: RoleType[key]
                }
            }
        }
        return null
    }

    registerPlayer(playerData: any) {
        log('register player: ', playerData)
        //UPDATE SANTA DATA
        for (let key in playerData.SANTA) {
            this.santaTeam[key].setPlayerID(playerData.SANTA[key].dclID)
            this.santaTeam[key].setAlive(playerData.SANTA[key].enable)
        }
        //UPDATE KRAMPUS DATA
        for (let key in playerData.KRAMPUS) {
            this.krampusTeam[key].setPlayerID(playerData.KRAMPUS[key].dclID)
            this.krampusTeam[key].setAlive(playerData.KRAMPUS[key].enable)
        }
    }

    disablePlayer(team: TeamType, role: RoleType) {
        if (team === TeamType.SANTA) {
            this.santaTeam[RoleType[role]].setAlive(false)
        }
        if (team === TeamType.KRAMPUS) {
            this.krampusTeam[RoleType[role]].setAlive(false)
        }
    }

    printTeam() {
        log('---santa team---')
        log('att1: ', this.santaTeam.ATT1.dclID)
        log('att2: ', this.santaTeam.ATT1.dclID)
        log('def: ', this.santaTeam.ATT1.dclID)

        log('---krampus team---')
        log('att1: ', this.krampusTeam.ATT1.dclID)
        log('att2: ', this.krampusTeam.ATT1.dclID)
        log('def: ', this.krampusTeam.ATT1.dclID)
    }

    destroyCell(_dclID: string, _dataPos) {
        log('DESTROY CELL', _dclID, _dataPos)

        let playerTarget: Player
        for (let player in this.santaTeam) {
            if (this.santaTeam[player] !== null && this.santaTeam[player].dclID === _dclID) {
                playerTarget = this.santaTeam[player]
                break
            }
        }
        for (let player in this.krampusTeam) {
            if (this.krampusTeam[player] !== null && this.krampusTeam[player].dclID === _dclID) {
                playerTarget = this.krampusTeam[player]
                break
            }
        }

        if (playerTarget.dclID !== userName) {
            playerTarget.fireAnimate(
                new Vector3(_dataPos.x, _dataPos.y, _dataPos.z),
                playerTarget.avatarModel.getComponent(Transform).position.add(new Vector3(0, 1.8, 0)),
                playerTarget.avatarModel.getComponent(Transform).rotation
            )

            let row = Math.floor((_dataPos.x - 1.5) / 5)
            let col = Math.floor((_dataPos.z - 1.5) / 5)

            gameEffect[TeamType[playerTarget.team]][RoleType[playerTarget.role]].playAnim(new Vector3(row * 5 + 4, 0.2, col * 5 + 4))
            //new GameEffect(new Vector3(row * 5 + 4, 0.2, col * 5 + 4), playerTarget.team, playerTarget.role)

            map.destroy(row, col)
        }
    }

    repairCell(_dclID: string, _dataPos) {
        log('REPAIR CELL', _dclID, _dataPos)
        let playerTarget: Player

        for (let player in this.santaTeam) {
            if (this.santaTeam[player] !== null && this.santaTeam[player].dclID === _dclID) {
                playerTarget = this.santaTeam[player]
                break
            }
        }
        for (let player in this.krampusTeam) {
            if (this.krampusTeam[player] !== null && this.krampusTeam[player].dclID === _dclID) {
                playerTarget = this.krampusTeam[player]
                break
            }
        }
        if (playerTarget.dclID !== userName) {
            playerTarget.fireAnimate(
                new Vector3(_dataPos.x, _dataPos.y, _dataPos.z),
                playerTarget.avatarModel.getComponent(Transform).position.add(new Vector3(0, 1.8, 0)),
                playerTarget.avatarModel.getComponent(Transform).rotation
            )

            let row = Math.floor((_dataPos.x - 1.5) / 5)
            let col = Math.floor((_dataPos.z - 1.5) / 5)

            gameEffect[TeamType[playerTarget.team]][RoleType[playerTarget.role]].playAnim(new Vector3(row * 5 + 4, 0.2, col * 5 + 4))
            //new GameEffect(new Vector3(row * 5 + 4, 0.2, col * 5 + 4), playerTarget.team, playerTarget.role)

            map.repair(row, col)
        }
    }

    updatePosAllPlayer(_dataPosAllPlayer) {
        //log('UPDATE POS FOR ALL PLAYER', _dataPosAllPlayer)
        for (let player in this.santaTeam) {
            if (_dataPosAllPlayer.SANTA[player] !== null && this.santaTeam[player] !== null) {
                if (this.santaTeam[player].dclID === userName) { }
                else {
                    this.santaTeam[player].updatePos(_dataPosAllPlayer.SANTA[player])
                }
            }
        }
        for (let player in this.krampusTeam) {
            if (_dataPosAllPlayer.KRAMPUS[player] !== null && this.krampusTeam[player] !== null) {
                if (this.krampusTeam[player].dclID === userName) { }
                else {
                    this.krampusTeam[player].updatePos(_dataPosAllPlayer.KRAMPUS[player])
                    //log('update pos krampus, ', _dataPosAllPlayer.KRAMPUS[player])
                }
            }
        }
    }

    update(dt: number) {

    }
}