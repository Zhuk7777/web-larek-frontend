import { ensureElement } from '../utils/utils';
import { Category, CategoryKey } from '../types';
import { ICard } from '../types';
import { CardView } from './cardView';

export class CatalogCardView extends CardView<ICard> {
	private imageElemnent: HTMLImageElement;
	private categoryElement: HTMLSpanElement;

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

		container.addEventListener('click', onClick);
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
}
