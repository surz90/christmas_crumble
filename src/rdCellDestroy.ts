import utils from "../node_modules/decentraland-ecs-utils/index"
import modelResources from "./resources/modelResources"

export const randomCellDestroy = (function () {
    let ray = new Entity()
    ray.addComponent(modelResources.arena.rayVertical)
    ray.addComponent(new Transform({
        position: new Vector3(24, 60, 24),
        scale: Vector3.Zero()
        //scale: new Vector3(20, -60, 20)
    }))
    engine.addEntity(ray)

    let rayAppearDelayEnt = new Entity()
    let rayDelayEntity = new Entity()

    engine.addEntity(rayAppearDelayEnt)
    engine.addEntity(rayDelayEntity)

    return {
        fireTo(CellCoor: Vector3) {
            ray.getComponent(Transform).position.x = CellCoor.x
            ray.getComponent(Transform).position.z = CellCoor.z
            ray.getComponent(Transform).position.y = 60

            //let startSize = ray.getComponent(Transform).scale.setAll(1)
            let startSize = Vector3.Zero()
            let endSize = new Vector3(20, -70, 20)


            // Scale the ray to size
            rayAppearDelayEnt.addComponentOrReplace(new utils.Delay(100, () => {
                ray.addComponentOrReplace(
                    new utils.ScaleTransformComponent(startSize, endSize, 0.5, () => { })
                )
            }))

            // Ray dissipates after half a second
            rayDelayEntity.addComponentOrReplace(
                new utils.Delay(7500, () => {
                    ray.addComponentOrReplace(new utils.ScaleTransformComponent(endSize, new Vector3(0, -70, 0), 0.2))
                })
            )

        }
    }
})()