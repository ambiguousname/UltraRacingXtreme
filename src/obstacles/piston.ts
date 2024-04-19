import { KnobsSetting } from "@yaireo/knobs";
import { Obstacle } from "./obstacle";

export class Piston extends Obstacle {
	static override knobs(reload : Function): Array<KnobsSetting> {
		return [{
			label: "Piston Force",
			value: 20,
			type: "range",
			min: 5,
			max: 100,
			step: 5,
			onChange: (v) => {Piston.fireStrength = parseInt(v.target.value);}
		}];
	}

	#matter : Phaser.Physics.Matter.MatterPhysics;
	pistonObj : MatterJS.BodyType;
	constructor(scene : Phaser.Scene) {
		super(scene);
		this.#matter = scene.matter;
		this.pistonObj = scene.matter.add.rectangle(-100, -100, 200, 200);
		this.pistonObj.mass = 1000;
	}

	firingTimer = 0;
	fireDirection : MatterJS.Vector;
	static fireStrength : number = 20;
	fire(): void {
		if (this.firingTimer <= 0) {
			this.#matter.body.setPosition(this.pistonObj, {x: 100, y: 100}, false);
			
			this.fireDirection = {x: Piston.fireStrength, y: 0};
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