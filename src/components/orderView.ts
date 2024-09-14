import { FormView } from './formView';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureAllElements } from '../utils/utils';

export class OrderView extends FormView<Omit<IOrderForm, 'phone' | 'email'>> {
	private altButtonsElement: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.altButtonsElement = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this.altButtonsElement.forEach((button) => {
			button.addEventListener('click', () => {
				this.altButtonsElement.forEach((button) => {
					this.toggleClass(button, 'button_alt-active', false);
				});
				this.toggleClass(button, 'button_alt-active', true);
				this.method = button.name;
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set method(value: string) {
		this.events.emit('payment:set', { paymentMethod: value });
	}
}
