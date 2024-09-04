import { ensureElement } from '../utils/utils';
import { Category, CategoryKey } from '../types';
import { ICard } from '../types';
import { CardView } from './cardView';

export class PreviewCardView extends CardView<ICard & { status: boolean }> {
	private imageElemnent: HTMLImageElement;
	private categoryElement: HTMLSpanElement;
	private buttonElement: HTMLButtonElement;
	private descriptionElement: HTMLParagraphElement;

	constructor(container: HTMLElement, onClick: (event: MouseEvent) => void) {
		super(container);

		this.imageElemnent = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);
		this.categoryElement = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);
		this.descriptionElement = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		this.buttonElement.addEventListener('click', onClick);
	}

	set image(src: string) {
		this.setImage(this.imageElemnent, src, this.titleElement.textContent);
	}

	get image(): string {
		return this.imageElemnent.src || '';
	}

	set category(value: CategoryKey) {
		this.setText(this.categoryElement, value);
		const categoryStyle = `card__category_${Category[value]}`;
		this.toggleClass(this.categoryElement, categoryStyle, true);
	}

	get category(): CategoryKey {
		return this.categoryElement.textContent as CategoryKey;
	}

	set status(status: boolean) {
		if (this.buttonElement) {
			if (this.price === null) {
				this.setText(this.buttonElement, 'Недоступно');
				this.buttonElement.setAttribute('disabled', 'disabled');
			} else {
				this.setText(
					this.buttonElement,
					status ? 'Уже в корзине' : 'В корзину'
				);
				if (status) this.buttonElement.setAttribute('disabled', 'disabled');
				else this.buttonElement.removeAttribute('disabled');
			}
		}
	}

	set description(text: string) {
		this.setText(this.descriptionElement, text);
	}

	get description(): string {
		return this.descriptionElement.textContent;
	}
}
