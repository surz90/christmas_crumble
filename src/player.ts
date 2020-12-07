import { AvatarModel } from "./avatarModel"
import { userName } from "./game"
import { RoleType, TeamType } from "./gameType"
import resources from "./resources/modelResources"
import utils from "../node_modules/decentraland-ecs-utils/index"
import { CellState, map } from "./gameMap"
import { uiFireSys } from "./UI/fireDelayUI"
import soundResources from "./resources/soundResources"
import { gameEffect } from "./gameEffect"

const serverUpdateRate = 1000 / 10

const santaModel = {
    ATT1: new AvatarModel(
        resources.models.santaModelATT1,
        new Transform({ position: new Vector3(19, 0.3, 29), scale: new Vector3(1.3, 1.3, 1.3) })
    ),
    ATT2: new AvatarModel(
        resources.models.santaModelATT2,
        new Transform({ position: new Vector3(19, 0.3, 19), scale: new Vector3(1.3, 1.3, 1.3) })
    ),
    DEF: new AvatarModel(
        resources.models.santaModelDEF,
        new Transform({ position: new Vector3(19, 0.3, 24), scale: new Vector3(1.3, 1.3, 1.3) })
    )
}
const krampusModel = {
    ATT1: new AvatarModel(
        resources.models.krampusModelATT1,
        new Transform({ position: new Vector3(29, 0.3, 29), scale: new Vector3(1.3, 1.3, 1.3) })
    ),
    ATT2: new AvatarModel(
        resources.models.krampusModelATT2,
        new Transform({ position: new Vector3(29, 0.3, 19), scale: new Vector3(1.3, 1.3, 1.3) })
    ),
    DEF: new AvatarModel(
        resources.models.krampusModelDEF,
        new Transform({ position: new Vector3(29, 0.3, 24), scale: new Vector3(1.3, 1.3, 1.3) })
    )
}

export class Player {
    //player attribute
    dclID: string
    team: TeamType
    role: RoleType
    socket: WebSocket

    //player state
    isAlive: boolean
    canFire: boolean = false

    //player 3d model and position
    avatarModel: AvatarModel
    currentPosition: Vector3 = Vector3.Zero()
    currentRotation: Quaternion = Quaternion.Zero()

    //handling lerp movement
    timeCount: number = 0
    lfraction: number = 0
    lorigin: Vector3 = Vector3.Zero()
    ltarget: Vector3 = Vector3.Zero()
    //handling slerp rotation
    sfraction: number = 0
    sorigin: Quaternion = Quaternion.Zero()
    starget: Quaternion = Quaternion.Zero()

    input = Input.instance
    ray: Entity

    constructor(_team: TeamType, _role: RoleType, _socket) {
        this.team = _team
        this.role = _role
        this.socket = _socket

        this.isAlive = false

        if (_team === TeamType.SANTA) {
            if (_role === RoleType.ATT1) this.avatarModel = santaModel.ATT1
            else if (_role === RoleType.ATT2) this.avatarModel = santaModel.ATT2
            else if (_role === RoleType.DEF) this.avatarModel = santaModel.DEF
        }
        else if (_team === TeamType.KRAMPUS) {
            if (_role === RoleType.ATT1) this.avatarModel = krampusModel.ATT1
            else if (_role === RoleType.ATT2) this.avatarModel = krampusModel.ATT2
            else if (_role === RoleType.DEF) this.avatarModel = krampusModel.DEF
        }

        this.ray = new Entity()
        if (this.team === TeamType.KRAMPUS) {
            this.ray.addComponent(new GLTFShape("models/ray.glb"))
        }
        else if (this.team === TeamType.SANTA) {
            this.ray.addComponent(new GLTFShape("models/ray.glb"))
        }

        this.ray.addComponent(new Transform({ position: new Vector3(8, 1.25, 8), scale: new Vector3(0, 0, 0) }))
        engine.addEntity(this.ray)

        this.fireListener()

        engine.addEntity(this.avatarModel)
        engine.addSystem(this)
    }
    setPlayerID(_dclID: string) {
        this.dclID = _dclID

        if (_dclID === userName) {
            this.avatarModel.getComponent(Transform).position = new Vector3(0, -0.8, 0)
            this.avatarModel.getComponent(Transform).rotation = Quaternion.Zero()
            log('INIT POS', this.avatarModel.getComponent(Transform).position)
            this.avatarModel.setParent(Attachable.AVATAR)
        }
        else {
            this.avatarModel.setParent(null)
            this.avatarModel.playIdle()

            let avatarTransform = this.avatarModel.getComponent(Transform)
            if (this.team === TeamType.SANTA) {
                if (this.role === RoleType.ATT1) {
                    avatarTransform.position = new Vector3(19, 0.1, 29)
                }
                if (this.role === RoleType.ATT2) {
                    avatarTransform.position = new Vector3(19, 0.1, 19)
                }
                if (this.role === RoleType.DEF) {
                    avatarTransform.position = new Vector3(19, 0.1, 24)
                }
            }
            if (this.team === TeamType.KRAMPUS) {
                if (this.role === RoleType.ATT1) {
                    avatarTransform.position = new Vector3(29, 0.1, 29)
                }
                if (this.role === RoleType.ATT2) {
                    avatarTransform.position = new Vector3(29, 0.1, 19)
                }
                if (this.role === RoleType.DEF) {
                    avatarTransform.position = new Vector3(29, 0.1, 24)
                }
            }
            this.lorigin.copyFrom(avatarTransform.position)
            this.ltarget.copyFrom(avatarTransform.position)
        }
    }
    setAlive(_enable: boolean) {
        this.isAlive = _enable
        if (this.isAlive) {
            this.avatarModel.getComponent(Transform).scale.setAll(1.3)
        }
        else {
            this.avatarModel.getComponent(Transform).scale.setAll(0)
        }
    }
    updatePos(_dataPos) {
        if (this.dclID !== '') {
            //log('update pos for, ', this.team, this.role)
            let transform = this.avatarModel.getComponent(Transform)
            this.lorigin = transform.position
            this.ltarget = new Vector3(_dataPos.pos.x, _dataPos.pos.y - 1.65, _dataPos.pos.z)
            this.lfraction = 0

            this.sorigin = transform.rotation
            this.starget.copyFrom(_dataPos.rot)
            this.sfraction = 0
        }
    }
    fireAnimate(_toPos: Vector3, _fromPos: Vector3, _fromRot: Quaternion) {
        log('hit cell')

        const rayDelayEntity = new Entity()
        engine.addEntity(rayDelayEntity)

        let throwDelayEnt = new Entity()
        engine.addEntity(throwDelayEnt)

        let rayAppearDelayEnt = new Entity()
        engine.addEntity(rayAppearDelayEnt)

        this.avatarModel.playThrow()

        throwDelayEnt.addComponentOrReplace(new utils.Delay(900, () => {
            this.avatarModel.stopThrow()
        }))

        let forwardVec = Vector3.Forward().scale(0.4).add(new Vector3(0.55, 0.45, 0)).rotate(_fromRot)
        let startPosition = _fromPos.clone().add(forwardVec)

        let distanceFromCamera = Vector3.Distance(startPosition, _toPos)

        this.ray.getComponent(Transform).position = startPosition
        this.ray.getComponent(Transform).position.y -= 0.5 // Offset ray
        this.ray.getComponent(Transform).lookAt(_toPos)

        //let startSize = ray.getComponent(Transform).scale.setAll(1)
        let startSize = new Vector3(0.5, 0.5, 0.5)
        let endSize = new Vector3(1.5, 1.5, distanceFromCamera)

        // Scale the ray to size
        rayAppearDelayEnt.addComponentOrReplace(new utils.Delay(100, () => {
            this.ray.addComponentOrReplace(
                new utils.ScaleTransformComponent(startSize, endSize, 0.3, () => { })
            )
        }))

        // Ray dissipates after half a second
        rayDelayEntity.addComponentOrReplace(
            new utils.Delay(1250, () => {
                this.ray.addComponentOrReplace(new utils.ScaleTransformComponent(endSize, new Vector3(0, 0, endSize.z), 0.2))
            })
        )
    }
    fireListener() {
        this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
            if (this.dclID === userName) {
                log('button down', this.dclID, userName, this.canFire)
                if (this.canFire) {
                    this.canFire = false
                    uiFireSys.fire()

                    soundResources.shot.getComponent(AudioSource).playOnce()
                    //add delay for every fire

                    let fireDelay = new Entity()
                    fireDelay.addComponent(new utils.Delay(2000, () => {
                        this.canFire = true
                        engine.removeEntity(fireDelay)
                    }))
                    engine.addEntity(fireDelay)

                    //for DEFENDER ROLE there is no collider in the target fire, 
                    //so using calculated intersect with XZ Plane
                    if (this.role === RoleType.DEF) {
                        try {
                            log('from button: ', e.hit.entityId, e.hit.meshName, e.hit.hitPoint)

                            let intersectHitPoint = findIntersectXZPlane(Camera.instance, 5)

                            let colliderHitDistance = Vector3.DistanceSquared(e.hit.hitPoint, Camera.instance.position)
                            let intersectDistance = Vector3.DistanceSquared(intersectHitPoint, Camera.instance.position)

                            if (colliderHitDistance < intersectDistance) {
                                log('collider hit first')
                                this.fireAnimate(e.hit.hitPoint, Camera.instance.position, Camera.instance.rotation)
                            }
                            else {
                                let row = Math.floor((intersectHitPoint.x - 1.5) / 5)
                                let col = Math.floor((intersectHitPoint.z - 1.5) / 5)

                                if (map.getMap()[row][col].state === CellState.DESTROYED) {

                                    //animate laser
                                    this.fireAnimate(intersectHitPoint, Camera.instance.position, Camera.instance.rotation)

                                    this.socket.send(JSON.stringify({
                                        method: ClientMethod.REPAIR,
                                        data: intersectHitPoint
                                    }))

                                    //repairing cell
                                    let row = Math.floor((intersectHitPoint.x - 1.5) / 5)
                                    let col = Math.floor((intersectHitPoint.z - 1.5) / 5)

                                    gameEffect[TeamType[this.team]][RoleType[this.role]].playAnim(new Vector3(row * 5 + 4, 5.2, col * 5 + 4))
                                    //new GameEffect(new Vector3(row * 5 + 4, 6, col * 5 + 4), this.team, this.role)

                                    map.repair(row, col)
                                }
                            }
                        }
                        catch (err) {
                            log('fire DEF error: ', err)
                        }

                    }

                    //for ATTACKER ROLE using raycast button global event
                    else if (this.role === RoleType.ATT1 || this.role === RoleType.ATT2) {
                        log('from button: ', e.hit.entityId, e.hit.meshName, e.hit.hitPoint)
                        if (e.hit.meshName == "cell_collider") {
                            //animate laser
                            this.fireAnimate(e.hit.hitPoint, Camera.instance.position, Camera.instance.rotation)

                            this.socket.send(JSON.stringify({
                                method: ClientMethod.DESTROY,
                                data: e.hit.hitPoint
                            }))

                            //removing cell from arena
                            let row = Math.floor((e.hit.hitPoint.x - 1.5) / 5)
                            let col = Math.floor((e.hit.hitPoint.z - 1.5) / 5)

                            gameEffect[TeamType[this.team]][RoleType[this.role]].playAnim(new Vector3(row * 5 + 4, 5.2, col * 5 + 4))
                            //new GameEffect(new Vector3(row * 5 + 4, 6, col * 5 + 4), this.team, this.role)

                            map.destroy(row, col)
                        }
                        else {
                            this.fireAnimate(e.hit.hitPoint, Camera.instance.position, Camera.instance.rotation)
                        }
                    }
                }
            }
        })
    }
    fall() {
        this.socket.send(JSON.stringify({
            method: ClientMethod.FALL
        }))
    }
    update(dt: number) {
        if (this.isAlive) {
            if (this.dclID === userName) {
                if (this.currentPosition.equals(Camera.instance.position)) {
                    this.avatarModel.playIdle()
                }
                else {
                    this.currentPosition.copyFrom(Camera.instance.position)
                    this.avatarModel.playRunning()
                }
            }
            else {
                let transform = this.avatarModel.getComponent(Transform)

                if (this.lfraction < 1) {
                    transform.position = Vector3.Lerp(this.lorigin, this.ltarget, this.lfraction)
                    this.lfraction += ((dt * 700) / serverUpdateRate)
                }
                if (this.sfraction < 1) {
                    transform.rotation = Quaternion.Slerp(this.sorigin, this.starget, this.sfraction)
                    this.sfraction += ((dt * 700) / serverUpdateRate)
                }

                if (Vector3.DistanceSquared(transform.position, this.ltarget) < 0.1) {
                    this.avatarModel.playIdle()
                }
                else {
                    this.avatarModel.playRunning()
                }
            }
        }
    }
}

function findIntersectXZPlane(camera: Camera, yOffset) {
    let refVect = new Vector3(0, 0, 1)
    let cam = Vector3.Zero()
    let camRot = Quaternion.Zero()
    let intersectPoint = Vector3.Zero()

    cam.copyFrom(camera.position)
    camRot.copyFrom(camera.rotation)

    refVect.rotate(camRot)
    refVect.y += cam.y

    let t = (yOffset + 0.416 - 1 * (cam.y)) / ((refVect.y) - (cam.y))
    intersectPoint.x = (refVect.x) * t + cam.x
    intersectPoint.z = (refVect.z) * t + cam.z
    intersectPoint.y = yOffset

    log("FROM INTERSECT FUNCTION: ", intersectPoint)

    //let intersectPointSnap = toWorldSnapPos(intersectPoint, centerPos, scale)
    //log("intersectRaw: ", intersectPoint, "\nintersectSnap: ", intersectPointSnap)

    return intersectPoint
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