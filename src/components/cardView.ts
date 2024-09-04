import { ensureElement } from '../utils/utils';
import { View } from './base/view';

export class CardView<T> extends View<T> {
	protected titleElement: HTMLTitleElement;
	protected priceElement: HTMLSpanElement;

	constructor(container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement<HTMLTitleElement>(
			'.card__title',
			container
		);
		this.priceElement = ensureElement<HTMLSpanElement>(
			'.card__price',
			container
		);
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}

	get title(): string {
		return this.titleElement.textContent || '';
	}

	set price(value: number) {
		this.setText(this.priceElement, value ? `${value} синапсов` : 'Бесценно');
	}

	get price(): number {
		return this.priceElement.textContent !== 'Бесценно'
			? Number(this.priceElement.textContent)
			: null;
	}
}
