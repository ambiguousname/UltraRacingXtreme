export class Car extends Phaser.GameObjects.GameObject {
	body : MatterJS.BodyType;
	world : Phaser.Physics.Matter.World;

	constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number) {
		super(scene, "car");

		this.world = scene.matter.world;

		this.body = scene.matter.bodies.rectangle(x, y, width, height);
		this.body.gameObject = this;
		this.world.add(this.body);

		scene.sys.updateList.add(this);
	}

	preUpdate(time : number, delta : number) {
		this.scene.matter.body.applyForce(this.body, this.body.position, {x: 0.001, y: 0});
	}
}