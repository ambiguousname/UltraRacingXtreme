declare module '@yaireo/knobs' {
	export default class Knobs {
		constructor(settings : Object);
		render() : void;
		toggle(state? : boolean) : void;
	}
}
