import { KnobsSetting } from "@yaireo/knobs";
import { Obstacle } from "./obstacle";

export class Wind extends Obstacle {
	static override knobs(reload : Function): KnobsSetting {
		return {
			label: "Wind Strength",
			type: "range",
			value: 1,
			min: 0.01,
			max: 5,
			step: 0.01,
			onChange: (v) => { Wind.windStrength = parseFloat(v.target.value); }
		};
	}

	static windStrength = 1;

	firing = false;
	fire(): void {
		this.firing = true;
	}

	stopFire(): void {
		this.firing = false;
	}

	update(): void {
		if (this.firing) {
			let bodies = this.scene.matter.world.getAllBodies();
			this.scene.matter.applyForce(bodies, {x: Wind.windStrength * (Math.random() - 0.5), y: Wind.windStrength * (Math.random() - 0.5)});
		}
	}
}