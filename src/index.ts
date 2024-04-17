import Phaser from "phaser";
import { Race } from "./scenes/race";

declare global {
	interface Window { game : Phaser.Game }
}

window.game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [Race],
	parent: "game",
	physics: {
		default: 'matter',
		matter: {
			debug: true,
			gravity: {
				y: 0,
				x: 0
			}
		}
	},
});