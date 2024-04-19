import { KnobsSetting } from "@yaireo/knobs";
import { Obstacle } from "./obstacle";
import { Car } from "../objects/car";

export class SpeedUp extends Obstacle {
	static override knobs(reload : Function): Array<KnobsSetting> {
		return [{
			label: "Boost Factor",
			type: "range",
			value: 2,
			min: 0.1,
			max: 10,
			step: 0.1,
			onChange: (v) => {SpeedUp.speedUpFactor = parseFloat(v.target.value)}
		},
		{
			label: "Boost Duration",
			type: "range",
			value: 3000,
			min: 100,
			max: 10000,
			step: 100,
			onChange: (v) => {SpeedUp.boostDuration = parseInt(v.target.value)}
		}];
	}

	
	#matter : Phaser.Physics.Matter.MatterPhysics;
	powerupObj : MatterJS.BodyType;
	speedUpCar : Car;
	speedTimer : number = 0;
	static speedUpFactor : number = 2;
	static boostDuration : number = 3000;
	constructor(scene : Phaser.Scene) {
		super(scene);
		this.#matter = scene.matter;
		this.#matter.world.on('collisionstart', (event : Object, bodyA : MatterJS.BodyType, bodyB : MatterJS.BodyType) => {
			if (bodyA == this.powerupObj || bodyB == this.powerupObj) {
				if (bodyB.gameObject instanceof(Car)) {
					(bodyB.gameObject as Car).forceOutMult = SpeedUp.speedUpFactor;
					this.speedUpCar = bodyA.gameObject;
				} else if (bodyA.gameObject instanceof(Car)) {
					(bodyA.gameObject as Car).forceOutMult = SpeedUp.speedUpFactor;
					this.speedUpCar = bodyA.gameObject;
				} else {
					return;
				}
				this.speedTimer = this.scene.time.now;
				this.#matter.world.remove(this.powerupObj);
				this.powerupObj = null;
			}
		});
	}

	speedActive : boolean;
	fire() {
		if ((this.powerupObj === undefined || this.powerupObj === null) && (this.speedUpCar === undefined || this.speedUpCar === null)){
			this.powerupObj = this.#matter.add.circle(200, this.scene.game.canvas.height - 200, 20);
			this.powerupObj.mass = 1000;
		}
	}
	
	stopFire(): void {
		return;
	}
	update(): void {
		if (this.speedTimer > 0 && this.scene.time.now - this.speedTimer > SpeedUp.boostDuration) {
			this.speedUpCar.forceOutMult = 1;
			this.speedUpCar = null;
			this.speedTimer = 0;
		}
	}
}