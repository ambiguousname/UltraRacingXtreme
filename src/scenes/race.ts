import Knobs from "@yaireo/knobs";
import { Car, DriveWheel, FreeWheel } from "../objects/car";
import { ObstacleManager } from "../obstacles/obstacleManager";

export class Race extends Phaser.Scene {
	static knobs : Knobs;

	constructor() {
		super();
		if (Race.knobs === undefined) {
			let settings = {
				knobs: [
					"Cars",
					{
						label: "Car Scale",
						type: "range",
						value: 1,
						min: 0.05,
						max: 3,
						step: 0.05,
						onChange: this.applyValue.bind(this, "carScale")
					},
					{
						label: "# of Cars",
						type: "range",
						value: 10,
						min: 1,
						max: 100,
						step: 1,
						onChange: this.applyValue.bind(this, "numCars")
					},
					{
						label: "Car Lookahead",
						type: "range",
						value: 0.1,
						min: 0,
						max: 1,
						step: 0.01,
						onChange: this.applyValue.bind(this, "carLookAhead")
					},
					{
						label: "Lookahead Staleness",
						type: "range",
						value: 1,
						min: 1,
						max: 4,
						step: 1,
						onChange: this.applyValue.bind(this, "carStalePos")
					},
					"Car Physics",
					{
						label: "Mass",
						type: "range",
						min: 1,
						value: 100,
						max: 1200,
						step: 1,
						onChange: this.applyValue.bind(this, "carMass")
					},
					{
						label: "Wheel Acceleration",
						type: "range",
						value: 0.001,
						min: 0,
						max: 0.05,
						step: 0.0001,
						onChange: this.applyValue.bind(this, "carAcceleration")
					},
					{
						label: "Car Friction",
						type: "range",
						value: 0.1,
						min: 0,
						max: 1,
						step: 0.01,
						onChange: this.applyValue.bind(this, "carFriction")
					},
					{
						label: "Car Static Friction",
						type: "range",
						value: 0.5,
						min: 0,
						max: 100,
						step: 0.5,
						onChange: this.applyValue.bind(this, "carStaticFriction")
					},
					{
						label: "Car Air Friction",
						type: "range",
						value: 0.01,
						min: 0,
						max: 0.2,
						step: 0.005,
						onChange: this.applyValue.bind(this, "carAirFriction")
					},
					"Track",
					{
						label: "Track Size",
						type: "range",
						value: 300,
						min: 10,
						max: window.innerWidth/2,
						step: 10,
						onChange: this.applyValue.bind(this, "ellipseSize")
					},
				]
			};
			Race.knobs = new Knobs(settings);
			ObstacleManager.loadKnobs(this.reload.bind(this));
		}

		Race.knobs.render();
	}

	applyValue(prop : string, v : any) {
		(Race as any)[prop] = parseFloat(v.target.value);
		this.reload();
	}

	reload() {
		if (this.scene !== undefined) {
			this.scene.restart();
		}
	}

	preload() {
		// this.load.image("track", "assets/track.png");
		// this.events.on('DESTROY', () => {
		// 	Race.knobs.DOM.iframe.remove();
		// }, this);
	}

	graphics : Phaser.GameObjects.Graphics;
	obstacleManager : ObstacleManager;

	create() {
		Race.knobs.toggle(true);

		this.graphics = this.add.graphics();
		
		this.matter.world.setBounds();
		this.matter.add.mouseSpring();
		
		this.drawCurve();
		this.drawCars();

		this.obstacleManager = new ObstacleManager(this);
	}

	static ellipseSize = 300;
	curve : Phaser.Curves.Ellipse;
	center : MatterJS.BodyType;
	drawCurve() {
		// Quick and dirty from https://stackoverflow.com/questions/70491667/matter-js-how-to-draw-an-ellipse
		let ellipseVerticesArray : Array<{x: number, y: number}> = [];

		let ellipseFlatness = 0.5;
		let ellipseVertices = 50;
		let ellipseSize = Race.ellipseSize;

		for (let i = 0; i < ellipseVertices; i++) {
			let x = ellipseSize * Math.cos(i);
			let y = ellipseFlatness * ellipseSize * Math.sin(i);
			ellipseVerticesArray.push({ x: x, y: y });
		}

		this.center = this.matter.add.fromVertices(this.game.canvas.width/2, this.game.canvas.height/2, ellipseVerticesArray);
		this.center.isStatic = true;

		let halfwayX = (ellipseVerticesArray[0].x + this.center.position.x)/2 - this.center.position.x;

		// Curve for the cars to follow:
		this.curve = new Phaser.Curves.Ellipse(this.center.position.x, this.center.position.y, halfwayX, ellipseFlatness * halfwayX);

        this.graphics.lineStyle(2, 0xffffff, 1);
		this.curve.draw(this.graphics);
	}

	static numCars = 1;
	static carScale = 1;
	static carMass = 0.8;
	static carLookAhead = 0.1;
	static carStalePos = 1;
	static carAcceleration = 0.00001;
	static carAirFriction = 0.01;
	static carStaticFriction = 0.5;
	static carFriction = 0.1;
	static maxCarVelocity = 100;
	drawCars(){
		let carWidth = 20 * Race.carScale;
		let carHeight = 40 * Race.carScale;

		let curveT = 0.3;

		for (let i = 0; i < Race.numCars; i++) {
			let p = this.curve.getPointAt(curveT);
			let a = new Phaser.Math.Vector2(p).subtract(this.center.position).angle();
			let side = ((i % 2 === 0) ? -1 : 1);
			p = p.add(new Phaser.Math.Vector2(Math.cos(a) * side * carWidth, Math.sin(a) * side * 0.5 * carHeight));

			let car = new Car(this, p.x, p.y, carWidth, carHeight, [FreeWheel, FreeWheel, DriveWheel, DriveWheel]);

			// let to = prevPoint.subtract(p);
			let tangent = this.curve.getTangentAt(curveT);
			this.matter.body.rotate(car.body, tangent.angle() - Math.PI/2);

			curveT -= Race.carScale * 0.01;
			if (curveT < 0) {
				curveT = 1;
			}
		}
	}

	update(time: number, delta: number): void {
		this.obstacleManager.update();
	}
}