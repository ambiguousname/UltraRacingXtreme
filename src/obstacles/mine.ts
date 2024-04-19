import { KnobsSetting } from "@yaireo/knobs";
import { Obstacle } from "./obstacle";

export class Mine extends Obstacle {
	static override knobs(reload : Function): Array<KnobsSetting> {
		return [{
			label: "Mine Push Distance",
			type: "range",
			value: 300,
			min: 100,
			max: 1000,
			step: 50,
			onChange: (v) => { Mine.mineDist = parseInt(v.target.value); }
		},
		{
			label: "Mine Force",
			type: "range",
			value: 0.01,
			min: 0.001,
			max: 0.05,
			step: 0.001,
			onChange: (v) => {Mine.mineForce = parseFloat(v.target.value);}
		}];
	}

	
	#matter : Phaser.Physics.Matter.MatterPhysics;
	constructor(scene : Phaser.Scene) {
		super(scene);
		this.#matter = scene.matter;
	}

	toApply : Array<MatterJS.Vector> = [];
	fire(): void {
		let mine = this.#matter.add.circle(Math.random() * this.scene.game.canvas.width, Math.random() * this.scene.game.canvas.height, 5);
		mine.mass = 10000;
		mine.label = "mine";
		mine.onCollideCallback = ((event : any) => {
			if (event.bodyA.label === "mine" && event.bodyB.label === "mine") {
				return;
			}
			this.toApply.push(mine.position);
		
			this.#matter.world.remove(mine);
			
		}).bind(this);
	}
	
	stopFire(): void {
		return;
	}

	static mineDist = 300;
	static mineForce = 0.05;
	update(): void {
		for (let pos of this.toApply) {
			for (let body of this.#matter.world.getAllBodies()) {
				if (body.label === "mine") {
					continue;
				}
				let dist = this.#matter.vector.sub(body.position, pos); 
				if (this.#matter.vector.magnitude(dist) < Mine.mineDist) {
					let inv = this.#matter.vector.create(Math.sign(dist.x) * (Mine.mineDist - Math.abs(dist.x)), Math.sign(dist.y) * (Mine.mineDist - Math.abs(dist.y)));
					this.#matter.applyForce(body, this.#matter.vector.mult(inv, Mine.mineForce));
				}
			}
		}
		if (this.toApply.length > 0) {
			this.toApply = [];
		}
	}

}