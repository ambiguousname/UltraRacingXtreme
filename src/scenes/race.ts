import Knobs from "@yaireo/knobs";

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
		}
		Race.knobs.render();
	}

	applyValue(prop : string, v : any) {
		(Race as any)[prop] = v.target.value;
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

	create() {
		Race.knobs.toggle(true);

		this.graphics = this.add.graphics();
		
		this.matter.world.setBounds();
		this.matter.add.mouseSpring();
		
		this.drawCurve();
		this.drawCars();
	}

	static ellipseSize = 300;
	curve : Phaser.Curves.Ellipse;
	drawCurve(){
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

		let center = this.matter.add.fromVertices(this.game.canvas.width/2, this.game.canvas.height/2, ellipseVerticesArray);
		center.isStatic = true;

		let halfwayX = (ellipseVerticesArray[0].x + center.position.x)/2 - center.position.x;

		// Curve for the cars to follow:
		this.curve = new Phaser.Curves.Ellipse(center.position.x, center.position.y, halfwayX, ellipseFlatness * halfwayX);

        this.graphics.lineStyle(2, 0xffffff, 1);
		this.curve.draw(this.graphics);
	}

	static numCars = 1;
	static carScale = 1;
	cars : Phaser.GameObjects.Group;
	drawCars(){
		this.cars = this.add.group();
		for (let i = 0; i < Race.numCars; i++) {
			this.matter.add.rectangle(0, 0, Race.carScale * 20, Race.carScale * 40);
		}

		let p = this.curve.getPoint(0);
	}
}