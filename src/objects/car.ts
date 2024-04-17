import { Race } from "../scenes/race";

export class Car extends Phaser.GameObjects.GameObject {
	body : MatterJS.BodyType;
	#curve : Phaser.Curves.Ellipse;
	#world : Phaser.Physics.Matter.World;
	#matter : Phaser.Physics.Matter.MatterPhysics;

	constructor(scene : Race, x : number, y : number, width : number, height : number) {
		super(scene, "car");

		this.#curve = scene.curve;

		this.#matter = scene.matter;
		this.#world = this.#matter.world;

		this.body = scene.matter.bodies.rectangle(x, y, width, height);
		this.body.gameObject = this;
		(this.body as any).destroy = (() => {
			this.#world.remove(this.body, true);
			this.body.gameObject = null;
		}).bind(this);
		this.#world.add(this.body);

		this.addToUpdateList();
	}

	get position() {
		return this.body.position;
	}

	getPositionOnCurve() : number {
		let relativeCoord = this.#matter.vector.sub(this.position, (this.scene as Race).center.position);
		let u = this.#matter.vector.angle(relativeCoord, {x: 0, y: 1})/(2 * Math.PI);
		return u;
	}

	preUpdate(time : number, delta : number) {
		let u = Math.fround(this.getPositionOnCurve()) + 0.1;
		if (u > 1) {
			u = 0;
		} else if (u < 0) {
			u = 1;
		}
		let goal = this.#curve.getPointAt(u);
		let dir = this.#matter.vector.sub(goal, this.body.position);
		dir = this.#matter.vector.normalise(dir);
		dir = this.#matter.vector.mult(dir, 0.001);

		this.#matter.body.applyForce(this.body, this.body.position, dir);
	}
}