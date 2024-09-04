import { View } from './base/view';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IFormValidity } from '../types';

export class FormView<T> extends View<IFormValidity> {
	protected submitElement: HTMLButtonElement;
	protected errorsElement: HTMLSpanElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitElement = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.errorsElement = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.container
		);

		this.container.addEventListener('input', (evt: InputEvent) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: SubmitEvent) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:changed`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.submitElement.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this.errorsElement, value);
	}

	render(state: Partial<T> & IFormValidity) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
