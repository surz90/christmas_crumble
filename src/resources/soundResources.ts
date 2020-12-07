import { Sound } from "../sound";

export default {
    music: new Sound(new AudioClip("sounds/gameplaymusic.mp3"), true),
    shot: new Sound(new AudioClip("sounds/lasershot.mp3"), false),
    tilecollapse: new Sound(new AudioClip("sounds/tilecollapse.mp3"), false),
    click: new Sound(new AudioClip("sounds/click.mp3"), false)
}