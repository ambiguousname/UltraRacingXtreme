import Phaser from "phaser";
import { Main } from "./scenes/main";

new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [Main],
	physics: {
		default: 'arcade'
	},
});