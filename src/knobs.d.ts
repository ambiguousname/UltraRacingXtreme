declare module '@yaireo/knobs' {
	export default class Knobs {
		constructor(settings : Object);
		render() : void;
		toggle(state? : boolean) : void;
		knobs : Array<string | KnobsSetting>;
	}

	export interface KnobsSetting {
		cssVar?: Array<any>,
		label?: string,
		type?: string,
		value?: number | string,
		defaultValue?: number | string,
		name?: string,
		min?: number,
		max?: number,
		step?: number,
		options?: Array<Object>,
		onChange?(v: any) : void,
	}
}
