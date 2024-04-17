import knobsMin from "@yaireo/knobs";
import Knobs from "@yaireo/knobs";


export class Race extends Phaser.Scene {
	constructor() {
		super();
		this.knobs = new Knobs({
			knobs: [
				{
					label: "# of Cars",
					type: "range",
					value: 10,
					min: 1,
					max: 100,
					step: 1,
				}
			]
		});
		this.knobs.render();
	}

	preload() {
		// this.load.image("track", "assets/track.png");
		this.events.on('DESTROY', () => {
			this.knobs.DOM.iframe.remove();
		}, this);
	}

	create() {
		this.knobs.toggle();
		// let img = this.add.image(0, 0, "track");
		// img.setPosition(this.game.canvas.width/2, this.game.canvas.height/2);

		
		// Quick and dirty from https://stackoverflow.com/questions/70491667/matter-js-how-to-draw-an-ellipse
		let ellipseVerticesArray = [];

		let ellipseFlatness = 0.5;
		let ellipseVertices = 50;
		let ellipseSize = 300;

		for (let i = 0; i < ellipseVertices; i++) {
			let x = ellipseSize * Math.cos(i);
			let y = ellipseFlatness * ellipseSize * Math.sin(i);
			ellipseVerticesArray.push({ x: x, y: y });
		}
		let center = this.matter.add.fromVertices(this.game.canvas.width/2, this.game.canvas.height/2, ellipseVerticesArray);
		center.isStatic = true;
	}
}