import { Race } from "../scenes/race";

type WheelConstructor = { new(position : Phaser.Math.Vector2, rotation : number, body : MatterJS.BodyType) : Wheel };

abstract class Wheel {
	relativePosition : Phaser.Math.Vector2;
	worldPosition : Phaser.Math.Vector2;
	rotation : number;
	worldRotation : number;
	attachedBody : MatterJS.BodyType;

	constructor(relativePosition : Phaser.Math.Vector2, rotation : number, body : MatterJS.BodyType) {
		this.relativePosition = relativePosition;
		this.rotation = rotation;
		this.attachedBody = body;
		this.#updateWorld();
	}

	#updateWorld() {
		this.worldPosition = new Phaser.Math.Vector2(this.relativePosition).rotate(this.attachedBody.angle).add(this.attachedBody.position);
		this.worldRotation = this.rotation + this.attachedBody.angle;
	}

	update(direction : Phaser.Types.Math.Vector2Like, delta : number, outForce : Phaser.Types.Math.Vector2Like) : void {
		this.#updateWorld();
	};
}

export class DriveWheel extends Wheel {
	rotClamp : [number, number] = [-20, 20];
	update(direction: Phaser.Types.Math.Vector2Like, delta: number, outForce: Phaser.Types.Math.Vector2Like): void {
		super.update(direction, delta, outForce);
		// let rotTo = new Phaser.Math.Vector2(direction);
		// let lerp = this.worldRotation + delta * (rotTo.angle() - this.rotation);
		// let worldRot = Math.max(Math.min(lerp, this.rotClamp[1]), this.rotClamp[0]);
		// this.rotation = worldRot - this.attachedBody.angle;

		outForce.x = direction.x * Race.carAcceleration * delta;
		outForce.y = direction.y * Race.carAcceleration * delta;
	}
}

export class FreeWheel extends Wheel {
	update(direction: Phaser.Types.Math.Vector2Like, delta: number, outForce: Phaser.Types.Math.Vector2Like): void {
		return;
	}

}

export class Car extends Phaser.GameObjects.GameObject {
	body : MatterJS.BodyType;
	#curve : Phaser.Curves.Ellipse;
	#world : Phaser.Physics.Matter.World;
	#matter : Phaser.Physics.Matter.MatterPhysics;
	// Back, Back, Front, Front
	#wheels : [Wheel, Wheel, Wheel, Wheel];

	constructor(scene : Race, x : number, y : number, width : number, height : number, wheels : [WheelConstructor, WheelConstructor, WheelConstructor, WheelConstructor]) {
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

		this.#wheels = [null, null, null, null];

		let positions = [new Phaser.Math.Vector2(-width/2, -height/2), new Phaser.Math.Vector2(width/2, -height/2), new Phaser.Math.Vector2(width/2, height/2), new Phaser.Math.Vector2(-width/2, height/2)];
		for (let i = 0; i < wheels.length; i++) {
			this.#wheels[i] = new wheels[i](positions[i], 0, this.body);
		}

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
		let staleRounding = Math.pow(10, Race.carStalePos);
		let rounded = Math.round(this.getPositionOnCurve() * staleRounding)/staleRounding;
		
		let graphics = (this.scene as Race).graphics;
		graphics.fillStyle(0xff0000, 1);


		let u = rounded + Race.carLookAhead;
		if (u > 1) {
			u = 0;
		} else if (u < 0) {
			u = 1 + u;
		}
		let goal = this.#curve.getPointAt(u);
		// graphics.fillPoint(goal.x, goal.y, 10);
		// let lookAhead = this.#curve.getTangentAt(u);

		let dir = this.#matter.vector.sub(goal, this.body.position);
		dir = this.#matter.vector.normalise(dir);

		

		for (let wheel of this.#wheels) {
			let outForce = this.#matter.vector.create(0, 0);

			wheel.update(dir, delta, outForce);
			
			// let p = new Phaser.Geom.Point(wheel.worldPosition.x, wheel.worldPosition.y);
			// let other_p = new Phaser.Geom.Point(p.x + Math.cos(wheel.worldRotation), p.y + Math.sin(wheel.worldRotation));
			// graphics.fillPoint(p.x, p.y, 1);
			// graphics.fillStyle(0xff0000, 1);
			// graphics.fillPoint(other_p.x, other_p.y, 1);

			this.#matter.body.applyForce(this.body, wheel.worldPosition, outForce);
		}

	}
}