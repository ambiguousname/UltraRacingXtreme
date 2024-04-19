import { KnobsSetting } from "@yaireo/knobs";
import { Race } from "../scenes/race";
import { Obstacle } from "./obstacle";
import { Wind } from "./wind";
import { Piston } from "./piston";

export class ObstacleManager {
	scene : Phaser.Scene;
	obstacles : Array<Obstacle>;
	static obstacleKnobs : Array<KnobsSetting> = new Array();
	constructor(scene : Phaser.Scene) {
		this.scene = scene;
		this.scene.input.keyboard.addListener('keydown', this.fireObstacle.bind(this));
		this.scene.input.keyboard.addListener('keyup', this.stopFireObstacle.bind(this));
		
		this.obstacles = new Array();
		this.obstacles.push(new Wind(scene));
		this.obstacles.push(new Piston(scene));
	}

	static loadKnobs(reload : Function) {
		Race.knobs.knobs = [...Race.knobs.knobs, ...[ "Obstacles",
			Wind.knobs(reload),
			Piston.knobs(reload),
		]];
	}

	static addToLoad(o : KnobsSetting) {
		ObstacleManager.obstacleKnobs.push(o);
	}

	/// From https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
	hash(str : string) : number {
		let hash = 0;
		if (str.length == 0) {
			return 0;
		}
		for (let i = 0; i < str.length; i++) {
			let chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	}

	fireObstacle(event : KeyboardEvent) {
		let obstacleToFire = this.hash(event.code) % this.obstacles.length;
		this.obstacles[obstacleToFire].fire();
	}

	stopFireObstacle(event : KeyboardEvent) {
		let obstacleToFire = this.hash(event.code) % this.obstacles.length;
		this.obstacles[obstacleToFire].stopFire();
	}

	addObstacle(obstacle : Obstacle) {
		this.obstacles.push(obstacle);
	}

	update() {
		for (let obstacle of this.obstacles) {
			obstacle.update();
		} 
	}
}