export class AvatarModel extends Entity {
    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

        this.addComponent(new Animator())

        this.getComponent(Animator).addClip(new AnimationState("runForward", { looping: true, speed: 1 }))
        this.getComponent(Animator).addClip(new AnimationState("idle", { looping: true }))
        this.getComponent(Animator).addClip(new AnimationState("throw", { looping: false, speed: 3 }))
        this.getComponent(Animator).addClip(new AnimationState("fall", { looping: true }))

        this.getComponent(Animator).getClip("idle").play()
    }

    playRunning() {
        if (this.getComponent(Animator).getClip("throw").playing === false) {
            this.stopAnimations()
            this.getComponent(Animator).getClip("runForward").play()
        }
    }

    playIdle() {
        if (this.getComponent(Animator).getClip("throw").playing === false) {
            this.stopAnimations()
            this.getComponent(Animator).getClip("idle").play()
        }
    }

    playThrow() {
        this.stopAnimations()
        this.getComponent(Animator).getClip("throw").play()
    }
    stopThrow() {
        this.getComponent(Animator).getClip("throw").playing = false
    }

    playFall() {
        this.stopAnimations()
        this.getComponent(Animator).getClip("fall").play()
    }

    // Bug workaround: otherwise the next animation clip won't play
    private stopAnimations() {
        this.getComponent(Animator).getClip("throw").stop()
        this.getComponent(Animator).getClip("runForward").stop()
        this.getComponent(Animator).getClip("idle").stop()
        this.getComponent(Animator).getClip("fall").stop
    }
}
