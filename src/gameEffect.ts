import { RoleType, TeamType } from "./gameType";
import modelResources from "./resources/modelResources";
import utils from "../node_modules/decentraland-ecs-utils/index"


//current workaround for playing multiple keyframe animation 
//gltf file export from blender

class GameEffect {
    entity: Entity = new Entity()
    clipNumber: number = 31
    effectAnimator: Animator = new Animator()
    clipAnim: AnimationState[] = []

    constructor(team: TeamType, role: RoleType) {
        this.entity.addComponent(new Transform({
            scale: Vector3.Zero()
        }))
        //offset entity position y axis,
        this.entity.getComponent(Transform).position.y = 5.3
        this.entity.addComponent(this.effectAnimator)
        this.addModel(team, role)
        this.addClip(role)

        engine.addEntity(this.entity)
    }
    private addModel(team: TeamType, role: RoleType) {
        if (team === TeamType.SANTA) {
            if (role === RoleType.ATT1 || role === RoleType.ATT2) {
                this.entity.addComponent(modelResources.effect.santaDestroy)
            }
            else if (role === RoleType.DEF) {
                this.entity.addComponent(modelResources.effect.santaRepair)
            }
        }
        if (team === TeamType.KRAMPUS) {
            if (role === RoleType.ATT1 || role === RoleType.ATT2) {
                this.entity.addComponent(modelResources.effect.krampusDestroy)
            }
            else if (role === RoleType.DEF) {
                this.entity.addComponent(modelResources.effect.krampusRepair)
            }
        }
    }
    private addClip(role: RoleType) {
        let clipName: string = ''
        let animationSpeed = 1

        if (role === RoleType.ATT1 || role === RoleType.ATT2) {
            clipName = 'destroy'
            this.clipNumber = 31
        }
        else if (role === RoleType.DEF) {
            clipName = 'repair'
            this.clipNumber = 3
        }

        if (role === RoleType.ATT1 || role === RoleType.ATT2) clipName = 'destroy'
        else if (role === RoleType.DEF) clipName = 'repair'

        for (let i = 0; i < this.clipNumber; i++) {
            let animationName = clipName + i.toString()
            this.clipAnim.push(new AnimationState(animationName))
            this.clipAnim[i].speed = animationSpeed
            this.clipAnim[i].looping = false
            this.effectAnimator.addClip(this.clipAnim[i])

            this.clipAnim[i].reset()
        }
    }

    private playAnim(_pos: Vector3) {
        let delayStart = new Entity()
        this.entity.getComponent(Transform).position = _pos
        delayStart.addComponent(new utils.Delay(200, () => {
            this.entity.getComponent(Transform).scale.setAll(0.8)
            engine.addEntity(this.entity)

            for (let i = 0; i < this.clipAnim.length; i++) {
                this.clipAnim[i].stop()
                this.clipAnim[i].reset()
                this.clipAnim[i].play()
            }
            engine.removeEntity(delayStart)
        }))
        engine.addEntity(delayStart)


        let delayRemoveAnim = new Entity()
        delayRemoveAnim.addComponent(new utils.Delay(3000, () => {
            this.entity.getComponent(Transform).scale.setAll(0)
            engine.removeEntity(delayRemoveAnim)
        }))
        engine.addEntity(delayRemoveAnim)
    }
}
/*
*/

export const gameEffect = {
    SANTA: {
        ATT1: new GameEffect(TeamType.SANTA, RoleType.ATT1),
        ATT2: new GameEffect(TeamType.SANTA, RoleType.ATT2),
        DEF: new GameEffect(TeamType.SANTA, RoleType.DEF)
    },
    KRAMPUS: {
        ATT1: new GameEffect(TeamType.KRAMPUS, RoleType.ATT1),
        ATT2: new GameEffect(TeamType.KRAMPUS, RoleType.ATT2),
        DEF: new GameEffect(TeamType.KRAMPUS, RoleType.DEF)
    }
}