import { View } from './base/view';
import { ensureElement } from '../utils/utils';
import { ISuccess } from '../types';

export class successView extends View<ISuccess> {
	private descriptionElement: HTMLParagraphElement;
	private closeElement: HTMLElement;

	constructor(container: HTMLElement, onClick: () => void) {
		super(container);

		this.descriptionElement = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.closeElement = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.closeElement.addEventListener('click', onClick);
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}
}
