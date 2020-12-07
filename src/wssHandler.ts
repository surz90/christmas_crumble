import { GameController } from "./gameController"
import utils from "../node_modules/decentraland-ecs-utils/index"
import { playerUI } from "./UI/playerUI"
import { map } from "./gameMap"
import { randomCellDestroy } from "./rdCellDestroy"
import { uiRandomDestroySys } from "./UI/randomFireUI"
import { gameCOnnectionUI } from "./UI/gameConnectionUI"
import { gameStatusUI } from "./UI/gameStatus"
import { RoleType, TeamType } from "./gameType"
import { uiFireSys } from "./UI/fireDelayUI"
import { Sound } from "./sound"
import soundResources from "./resources/soundResources"
import { gameResultUI } from "./UI/gameResultUI"
import { gameTitleUI } from "./UI/titleUI"

export const WSSHandler = (function () {
    let socket: WebSocket

    let gameLogic = new GameController()

    let userData = {
        userName: null,
        userEthAdd: null,
        realm: null
    }

    let readyState: any

    function openSocket(wssurl) {
        return new Promise((resolve, reject) => {

            socket = new WebSocket(wssurl)

            socket.onopen = (res) => {
                log('wss OK')
                gameLogic.initGameLogic(socket)
                readyState = socket.readyState
                resolve(socket.readyState)
            }

            socket.onerror = (res) => {
                gameCOnnectionUI.setText('connection to server FAILED', Color4.Red())
                log('wss ERR ')
                readyState = socket.readyState
                reject(socket.readyState)
            }

            socket.onclose = (res) => {
                gameCOnnectionUI.setText('connection to server FAILED', Color4.Red())
                log('wss CLOSED')
                readyState = socket.readyState
            }

            socket.onmessage = (event) => {
                //let data = JSON.parse(event.data)
                socketMsgHandling(event.data)
            }
        })
    }

    function socketMsgHandling(_msg) {
        let msg: any = null
        let uuID: any = null
        let method: any = null
        let data: any = null

        try {
            msg = JSON.parse(_msg)
            method = msg.method
            data = msg.data

            //log('WSS DATA: ', msg)
        }
        catch (err) {
            log(err)
            return
        }

        switch (method) {
            case ServerMethod.INIT:
                let uuID = data
                let method

                log('connection to server OK')

                gameCOnnectionUI.setText('connection to server OK', Color4.Green())

                sendMsg({
                    method: ClientMethod.REGISTER,
                    data: {
                        dclID: userData.userName,
                        ethAdd: userData.userEthAdd,
                        realm: userData.realm
                    }
                })

                break

            case ServerMethod.UPDBOARD:
                let destroyArr = data.des
                let disableArr = data.dis
                log('board: ', destroyArr)

                map.forceUpdate(destroyArr)
                break

            case ServerMethod.MESSAGE:
                log('message: ', data.text)

                break

            case ServerMethod.UPDPLAYER:
                log('update player from server', data, gameLogic.isStart)
                playerUI.setPlayerUI(data)
                gameLogic.registerPlayer(data)

                if (gameLogic.isStart === false) {
                    gameStatusUI.setText('Wwaiting player to JOIN')
                    gameStatusUI.hideSpectateBtn()
                }

                break

            
            case ServerMethod.PLAYERFALL:
                log('player fall', data, gameLogic.isStart)
                gameLogic.disablePlayer(data.team, data.role)
                playerUI.disablePlayer(data.team, data.role)
                break
                

            case ServerMethod.UPDPOS:
                gameLogic.updatePosAllPlayer(data)
                break

            case ServerMethod.NEWGAME:
                gameLogic.startGame()

                if (gameLogic.isUserPlaying() !== null) {
                    uiFireSys.show()
                }
                uiRandomDestroySys.show()

                log('GAME START !!!')
                break

            case ServerMethod.ENDGAME:
                gameTitleUI.show()
                let titleDelay = new Entity()
                titleDelay.addComponent(new utils.Delay(10000, () => {
                    gameTitleUI.hide()
                    engine.removeEntity(titleDelay)
                }))
                engine.addEntity(titleDelay)

                log('GAME END !!! winner: ', data)
                gameResultUI.showResult(+data.win)

                gameLogic.endGame()
                uiFireSys.hide()
                uiRandomDestroySys.hide()

                gameStatusUI.setText('Waiting player to JOIN!')
                gameStatusUI.hideSpectateBtn()

                break

            case ServerMethod.DESTROY:
                log('destroy data from server: ', data)
                gameLogic.destroyCell(data.player, data.coor)

                break

            case ServerMethod.RANDOMDESTROY:
                log('random destroy: ', data)

                uiRandomDestroySys.fire()

                let RC = cellNumToRC(data)
                log('row: ', RC.row, ' col: ', RC.col)
                log((RC.row * 5) + 4, (RC.row * 5) + 4)

                randomCellDestroy.fireTo(new Vector3(RC.row * 5 + 4, 0, RC.col * 5 + 4))

                let destroyDelay = new Entity()
                destroyDelay.addComponent(new utils.Delay(1000, () => {
                    map.destroy(RC.row, RC.col)
                    engine.removeEntity(destroyDelay)
                }))
                engine.addEntity(destroyDelay)
                break

            case ServerMethod.REPAIR:
                log('repair data from server: ', data)
                gameLogic.repairCell(data.player, data.coor)
                break

            case ServerMethod.RESET:

                break
        }
    }

    async function sendMsg(_msg: any) {
        socket.send(JSON.stringify(_msg))
    }

    return {
        init(_wssurl: string, _userData) {
            userData = _userData

            let delayStart = new Entity()

            delayStart.addComponent(new utils.Delay(3000, () => {
                openSocket(_wssurl)
                    .then(() => {
                        log("websocket connection OK ")
                        //gameLogic.setWss(this)
                    })
                    .then(() => {
                        //do something
                    })
                    .catch((err) => {
                        log("can't connect to websocket ", err)
                    })

                engine.removeEntity(delayStart)
            }))

            engine.addEntity(delayStart)
        },

        async sendMsg(_msg: any) {
            socket.send(JSON.stringify(_msg))
        },

        getReadyState() {
            return readyState
        }
    }
})()

function cellNumToRC(cellNum: number) {
    return {
        row: Math.floor(cellNum / 9),
        col: cellNum % 9
    }
}
function RcToCellNum(row: number, col: number) {
    return (9 * row + col)
}

export enum ClientMethod {
    REGISTER = 'REG',
    REQGAMESTATE = 'REQ',
    JOIN = 'JOIN',
    RECONNECT = 'RECONN',
    CANCELJOIN = 'CANCELJOIN',

    DESTROY = 'DR',
    REPAIR = 'REP',
    FALL = 'FL',
    EMPTYFIRE = 'EF',

    MOVEDATA = 'D'
}

export enum ServerMethod {
    MESSAGE = 'MESSAGE',

    UPDPLAYER = 'UPDPLAYER',
    UPDBOARD = 'UPDBOARD',
    UPDTURN = 'UPDTURN',

    MOVE = 'MOVE',
    ROTATE = 'ROTATE',
    FIRE = 'FIRE',

    RESET = 'RESET',
    NEWGAME = 'NEWGAME',
    ENDGAME = 'ENDGAME',
    INIT = 'INIT',

    //theme
    UPDPOS = 'UP',

    PLAYERFALL = 'FA',
    DESTROY = 'DR',
    RANDOMDESTROY = 'RD',
    REPAIR = 'REP',
}