import { KnobsSetting } from "@yaireo/knobs";

export abstract class Obstacle {
	public scene : Phaser.Scene;
	constructor(scene : Phaser.Scene) {
		this.scene = scene;
	}

	static knobs(reload : Function): KnobsSetting { return {}; }
	abstract fire() : void;
	abstract stopFire() : void;
	abstract update() : void;
}