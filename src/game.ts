import { getUserData, getUserPublicKey } from '@decentraland/Identity'
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { ClientMethod, WSSHandler } from "./wssHandler"
import { map } from "./gameMap"
import utils from "../node_modules/decentraland-ecs-utils/index"
import { uiRandomDestroySys } from "./UI/randomFireUI"
import { uiFireSys } from "./UI/fireDelayUI"
import * as ui from '../node_modules/@dcl/ui-utils/index'
import soundResources from './resources/soundResources'
import { gameInstructionUI } from './UI/instructionUI'
import { gameTitleUI } from './UI/titleUI'



export let userName, userEthAdd, realm


let prompt = new ui.OkPrompt(
    'You are entering battleground!\n\nYou can not see each other unless you join the army!',
    () => { },
    'Ok',
    true
)

uiFireSys.hide()
uiRandomDestroySys.hide()
gameInstructionUI.show()

gameTitleUI.show()
let titleDelay = new Entity()
titleDelay.addComponent(new utils.Delay(10000, () => {
    gameTitleUI.hide()
    engine.removeEntity(titleDelay)
}))
engine.addEntity(titleDelay)


soundResources.music.setVolume(0.8)
soundResources.music.getComponent(AudioSource).playing = true


const modArea = new Entity()
modArea.addComponent(
    new AvatarModifierArea({
        area: { box: new Vector3(48, 20, 48) },
        modifiers: [AvatarModifiers.HIDE_AVATARS],
    })
)
modArea.addComponent(
    new Transform({
        position: new Vector3(24, 10, 24),
    })
)



//FETCH USER INFORMATION
const FetchuserInformation = (async () => {
    userName = (await getUserData()).displayName
    log(userName)
    
    //userEthAdd = await getUserPublicKey()
    //log(userEthAdd)
    
    realm = (await getCurrentRealm()).displayName
    log(realm)

    return {
        userName: userName,
        userEthAdd: '',
        realm: realm
    }
})

export class checkPlayerIsMove {
    //send position data to server every 100 ms
    countLoop = 0
    maxCount = 100 / 1000

    constructor() {

    }
    update(dt: number) {
        if (this.countLoop > this.maxCount) {
            //log(this.countLoop)

            let camRot = Quaternion.Zero()
            camRot.copyFrom(Camera.instance.rotation)

            //log(Camera.instance.position)

            this.countLoop = 0
            if (WSSHandler.getReadyState() === WebSocket.OPEN) {
                WSSHandler.sendMsg({
                    method: ClientMethod.MOVEDATA,
                    data: {
                        pos: (Camera.instance.position),
                        rot: yRotation(Camera.instance.rotation)
                    }
                })
            }
        }
        else {
            this.countLoop += dt
        }
    }
}
engine.addSystem(new checkPlayerIsMove())

let startDelay = new Entity()
startDelay.addComponent(new utils.Delay(5000, () => {

    FetchuserInformation()
        .then((userData) => {
            log('fetch success')
            WSSHandler.init('wss://localhost', userData)
            engine.addEntity(modArea)
        })
        .catch((err) => {
            log('fetch data failed', err)
            log('please refresh scene')
        })
}))
engine.addEntity(startDelay)

map.init()


function yRotation(q: Quaternion) {
    let theta = Math.atan2(q.y, q.w)
    return new Quaternion(0, Math.sin(theta), 0, Math.cos(theta))
}
