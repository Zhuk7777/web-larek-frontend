import { View } from './base/view';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types';

export class Page extends View<IPage> {
	private counterElement: HTMLSpanElement;
	private catalogElement: HTMLElement;
	private wrapperElement: HTMLElement;
	private basketElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			container
		);
		this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
		this.wrapperElement = ensureElement<HTMLElement>(
			'.page__wrapper',
			container
		);
		this.basketElement = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this.basketElement.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this.counterElement, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this.catalogElement.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this.wrapperElement.classList.add('page__wrapper_locked');
		} else {
			this.wrapperElement.classList.remove('page__wrapper_locked');
		}
	}
}
