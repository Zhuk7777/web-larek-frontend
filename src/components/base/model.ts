import { IEvents } from './events';

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this as Object, data);
	}

	emit(event: string, data?: object) {
		this.events.emit(event, data ?? {});
	}
}
