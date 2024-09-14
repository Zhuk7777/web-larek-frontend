import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { View } from './base/view';
import { CardView } from './cardView';

export class BasketCardView extends CardView<ICard & { index: number }> {
	private buttonElement: HTMLButtonElement;
	private indexElement: HTMLSpanElement;

	constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
		super(container);

		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		this.indexElement = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			container
		);
		this.buttonElement.addEventListener('click', onClick);
	}

	set index(value: number) {
		this.setText(this.indexElement, value.toString());
	}

	get index(): number {
		return Number(this.indexElement.textContent);
	}
}
