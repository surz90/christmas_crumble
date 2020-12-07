import utils from "../node_modules/decentraland-ecs-utils/index"
import modelResources from "./resources/modelResources"
import soundResources from "./resources/soundResources"

export enum CellState {
    STATIC,
    NORMAL,
    DESTROYED
}

export const map = (function () {
    let map: Cell[][] = []
    let cellsStatic: number[] = [
        11, 13, 15,
        18, 20, 21, 24, 26,
        37, 40, 43,
        54, 56, 59, 60, 62,
        65, 67, 69]
    let cellsDestroy: number[] = []

    let mapParentEntity = new Entity()
    mapParentEntity.addComponent(new Transform({
        position: new Vector3(0, 0, 0)
    }))
    engine.addEntity(mapParentEntity)

    let pBorderEntity = new Entity()
    pBorderEntity.addComponent(modelResources.arena.arenaBorder)
    pBorderEntity.addComponent(new Transform({
        position: new Vector3(24, 0, 24),
        scale: Vector3.Zero()
    }))
    engine.addEntity(pBorderEntity)

    let nBorderEntity = new Entity()
    nBorderEntity.addComponent(modelResources.arena.baseBorder)
    nBorderEntity.addComponent(new Transform({
        position: new Vector3(24, 0, 24)
    }))
    engine.addEntity(nBorderEntity)

    function cellNumToRC(cellNum: number) {
        return {
            row: Math.floor(cellNum / 9),
            col: cellNum % 9
        }
    }
    function RcToCellNum(row: number, col: number) {
        return (9 * row + col)
    }
    return {
        init() {
            for (let row = 0; row < 9; row++) {
                map[row] = []
                for (let col = 0; col < 9; col++) {
                    if (cellsStatic.indexOf(RcToCellNum(row, col)) !== -1) {
                        map[row][col] = new Cell(row, col, CellState.STATIC)
                    }
                    else {
                        map[row][col] = new Cell(row, col, CellState.NORMAL)
                    }

                    map[row][col].entity.setParent(mapParentEntity)
                    map[row][col].updateCellView()
                }
            }
        },

        moveGameArena() {
            mapParentEntity.getComponent(Transform).position = new Vector3(0, 5, 0)
            pBorderEntity.getComponent(Transform).scale.setAll(1)
            nBorderEntity.getComponent(Transform).scale.setAll(0)
        },
        moveBackArena() {
            mapParentEntity.getComponent(Transform).position = new Vector3(0, 0, 0)
            pBorderEntity.getComponent(Transform).scale.setAll(0)
            nBorderEntity.getComponent(Transform).scale.setAll(1)
        },
        forceUpdate(_cellsDestroy: number[]) {
            log('force update')
            cellsDestroy = _cellsDestroy

            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (cellsStatic.indexOf(RcToCellNum(row, col)) !== -1) {
                        map[row][col].state = CellState.STATIC
                    }
                    else {
                        map[row][col].entity.getComponent(Transform).scale.setAll(1)
                        map[row][col].repairCell()
                        map[row][col].state = CellState.NORMAL
                    }
                }
            }

            for (let idx in cellsDestroy) {
                let RC = cellNumToRC(cellsDestroy[idx])
                map[RC.row][RC.col].destroyCell()
                map[RC.row][RC.col].state = CellState.DESTROYED
            }
            /*
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    map[row][col].updateCellView()
                }
            }
            */
        },
        getMap() {
            return map
        },
        destroy(row: number, col: number) {
            soundResources.tilecollapse.getComponent(AudioSource).playOnce()
            log('destroy cell: ', row, col)

            map[row][col].destroyCell()
            map[row][col].updateCellView()
        },
        repair(row: number, col: number) {
            soundResources.tilecollapse.getComponent(AudioSource).playOnce()
            log('repair cell: ', row, col)

            map[row][col].repairCell()
            map[row][col].updateCellView()
        }
    }
})()


export class Cell {
    row: number
    col: number
    state: CellState

    entity: Entity

    effectAnimator: Animator = new Animator()
    destroyAnim: AnimationState[] = []
    repairAnim: AnimationState[] = []

    constructor(row: number, col: number, state: CellState) {
        this.row = row
        this.col = col
        this.state = state

        this.initCellEntity()
    }

    private getModel() {
        let model: GLTFShape

        if (this.state === CellState.NORMAL || this.state === CellState.DESTROYED) {
            if (this.row < 4) model = modelResources.arena.cellSA
            else if (this.row > 4) model = modelResources.arena.cellKA
            else model = modelResources.arena.cellCA
        }
        if (this.state === CellState.STATIC) {
            if (this.row < 4) model = model = modelResources.arena.cellStaticSA
            else if (this.row > 4) model = modelResources.arena.cellStaticKA
            else model = modelResources.arena.cellStaticCA
        }
        log('gltf data: ', model.data.src)
        return model
    }

    private initCellEntity() {
        this.entity = new Entity()
        this.entity.addComponent(this.getModel())
        this.entity.addComponent(new Transform({
            position: new Vector3((this.row * 5) + 4, 0.2, (this.col * 5) + 4)
        }))

        this.entity.addComponent(this.effectAnimator)

        //add clip
        let clipNumber = 8

        //add fall (destroy) clip
        for (let i = 0; i < clipNumber; i++) {
            let animationName = 'fall' + i.toString()
            this.destroyAnim.push(new AnimationState(animationName))
            this.destroyAnim[i].looping = false
            this.effectAnimator.addClip(this.destroyAnim[i])

            this.destroyAnim[i].reset()
            //this.destroyAnim[i].play()
        }

        for (let i = 0; i < clipNumber; i++) {
            let animationName = 'back' + i.toString()
            this.repairAnim.push(new AnimationState(animationName))
            this.repairAnim[i].looping = false
            this.effectAnimator.addClip(this.repairAnim[i])

            this.repairAnim[i].reset()
            this.repairAnim[i].speed = 3
            this.repairAnim[i].play()
        }
    }

    destroyCell() {
        if (this.state !== CellState.DESTROYED)
            this.animDestroyCell()

        this.state = CellState.DESTROYED
    }
    repairCell() {
        if (this.state !== CellState.NORMAL) {
            this.animRepairCell()
        }
        this.state = CellState.NORMAL
    }
    updateCellView() {
        if (this.state === CellState.DESTROYED) {
            let destroyDelayEnt = new Entity()
            destroyDelayEnt.addComponent(new utils.Delay(1000, () => {
                this.entity.getComponent(Transform).scale.setAll(0)
                engine.removeEntity(destroyDelayEnt)
            }))
            engine.addEntity(destroyDelayEnt)
        }
        else if (this.state === CellState.NORMAL || this.state === CellState.STATIC) {
            this.entity.getComponent(Transform).scale.setAll(1)
        }

        if (this.entity.isAddedToEngine()) { }
        else engine.addEntity(this.entity)
    }
    private resetAnim() {
        for (let i = 0; i < this.destroyAnim.length; i++) {
            this.destroyAnim[i].speed = 2
            this.destroyAnim[i].stop()
            this.destroyAnim[i].reset()
        }
        for (let i = 0; i < this.repairAnim.length; i++) {
            this.repairAnim[i].speed = 2
            this.repairAnim[i].stop()
            this.repairAnim[i].reset()
        }
    }
    private animDestroyCell() {
        this.resetAnim()
        //log('destroy animation!')
        for (let i = 0; i < this.destroyAnim.length; i++) {
            this.destroyAnim[i].play()
            //log(this.destroyAnim[i].data)
        }
    }
    private animRepairCell() {
        this.resetAnim()
        //log('repair cell animation')
        for (let i = 0; i < this.repairAnim.length; i++) {
            this.repairAnim[i].play()
            //log(this.repairAnim[i].data)
        }
    }
}