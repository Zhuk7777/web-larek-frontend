import { View } from './base/view';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { IBasket } from '../types';

export class BasketView extends View<IBasket> {
	private listElement: HTMLElement;
	private totalElement: HTMLElement;
	private buttonElement: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.listElement = ensureElement<HTMLUListElement>(
			'.basket__list',
			container
		);
		this.totalElement = ensureElement<HTMLSpanElement>(
			'.basket__price',
			container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		if (this.buttonElement) {
			this.buttonElement.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.listElement.replaceChildren(...items);
			this.buttonElement.removeAttribute('disabled');
		} else {
			this.listElement.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.buttonElement.setAttribute('disabled', 'disabled');
		}
	}

	set total(total: number) {
		this.setText(this.totalElement, `${total} синапсов`);
	}
}
