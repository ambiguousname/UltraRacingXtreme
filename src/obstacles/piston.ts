import { KnobsSetting } from "@yaireo/knobs";
import { Obstacle } from "./obstacle";

export class Piston extends Obstacle {
	static override knobs(reload : Function): KnobsSetting {
		return {};
	}

	#matter : Phaser.Physics.Matter.MatterPhysics;
	pistonObj : MatterJS.BodyType;
	constructor(scene : Phaser.Scene) {
		super(scene);
		this.#matter = scene.matter;
		this.pistonObj = scene.matter.add.rectangle(-100, -100, 200, 200);
		this.pistonObj.mass = 500;
	}

	firingTimer = 0;
	fireDirection : MatterJS.Vector;
	fire(): void {
		if (this.firingTimer <= 0) {
			this.#matter.body.setPosition(this.pistonObj, {x: 100, y: 100}, false);
			
			this.fireDirection = {x: 50, y: 0};
			this.firingTimer = this.scene.time.now;
		}
	}

	stopFire(): void {
		
	}
	
	update(): void {
		if (this.firingTimer > 0) {
			this.#matter.applyForce(this.pistonObj, this.fireDirection);
			if (this.scene.time.now - this.firingTimer > 1500) {
				this.firingTimer = 0;
				this.#matter.body.setPosition(this.pistonObj, {x: -100, y: -100}, false);
				this.#matter.body.setVelocity(this.pistonObj, {x: 0, y: 0});
			}
		}
		// throw new Error("Method not implemented.");
	}
	
}