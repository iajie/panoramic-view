export const defineCustomElement = (name: string, element: CustomElementConstructor) => {
    if (!window.customElements.get(name)) {
        window.customElements.define(name, element);
    }
}

export const show = (element: HTMLElement | string) => getElement(element).style.display = '';
export const hide = (element: HTMLElement | string) => getElement(element).style.display = 'none';

export const getElement = (element: HTMLElement | string) => {
    if (element instanceof Element) {
        return element;
    } else {
        let elementNode = document.getElementById(element);
        if (!elementNode) {
            elementNode = document.querySelector(element);
            if (elementNode) {
                return elementNode;
            } else {
                throw new Error(`Element ${element} not found`);
            }
        } else {
            return elementNode;
        }
    }
}