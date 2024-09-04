import { View } from './base/view';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModal } from '../types';

export class ModalView extends View<{}> {
	private closeButtonElement: HTMLButtonElement;
	private contentElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButtonElement.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.contentElement.addEventListener('click', (event) =>
			event.stopPropagation()
		);
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
