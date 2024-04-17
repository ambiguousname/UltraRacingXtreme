import Phaser from "phaser";
import { Race } from "./scenes/race";

new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [Race],
	parent: "game",
	physics: {
		default: 'matter',
		matter: {
			debug: true
		}
	},
});