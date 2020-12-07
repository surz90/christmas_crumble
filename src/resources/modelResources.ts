export default {
    models: {
        santaModelATT1: new GLTFShape('models/santaATT1.gltf'),
        santaModelATT2: new GLTFShape('models/santaATT2.gltf'),
        santaModelDEF: new GLTFShape('models/santaDEF.gltf'),
        krampusModelATT1: new GLTFShape('models/krampusATT1.gltf'),
        krampusModelATT2: new GLTFShape('models/krampusATT2.gltf'),
        krampusModelDEF: new GLTFShape('models/krampusDEF.gltf'),
    },
    effect: {
        santaDestroy: new GLTFShape('models/santaDestroyEff.gltf'),
        krampusDestroy: new GLTFShape('models/krampusDestroyEff.gltf'),
        santaRepair: new GLTFShape('models/santaRepairEff.gltf'),
        krampusRepair: new GLTFShape('models/krampusRepairEff.gltf'),
    },
    arena: {
        cellSA: new GLTFShape('models/cellSA.gltf'),
        cellKA: new GLTFShape('models/cellKA.gltf'),
        cellCA: new GLTFShape('models/cellCA.gltf'),

        cellStaticSA: new GLTFShape('models/cellStaticSA.gltf'),
        cellStaticKA: new GLTFShape('models/cellStaticKA.gltf'),
        cellStaticCA: new GLTFShape('models/cellStaticCA.gltf'),

        //arenaBorder: new GLTFShape('models/arenaBorder.gltf'),
        arenaBorder: new GLTFShape('models/playArena.gltf'),
        baseBorder: new GLTFShape('models/baseBorder.gltf'),

        ray: new GLTFShape('models/ray.glb'),

        rayVertical: new GLTFShape('models/rayVert.gltf')
    }
}