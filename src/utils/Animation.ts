import { getElement } from "./DomUtils.ts";

interface AnimationConfig {
    [key: string]: string | number;
}

interface AnimationQueueItem {
    callback?: () => void;
    animations: [string, string | number, number][];
}

/**
 * 由jelle修改而来
 */
export class JelleAnimator {
    private element: HTMLElement;
    private animationQueue: AnimationQueueItem[] = [];
    private currentStep = 0;
    private isStopped = false;

    constructor(element: HTMLElement | string) {
        this.element = getElement(element);
    }

    static create(element: HTMLElement | string): JelleAnimator {
        return new JelleAnimator(element);
    }

    stop(): this {
        this.isStopped = true;
        this.animationQueue = [];
        return this;
    }

    animate(properties: AnimationConfig, duration: number, callback?: () => void): this {
        const queueItem: AnimationQueueItem = {
            callback,
            animations: []
        };

        for (const [prop, value] of Object.entries(properties)) {
            queueItem.animations.push([prop, value, duration]);
        }

        this.animationQueue.push(queueItem);
        this.processQueue();
        return this;
    }

    private processQueue(): void {
        if (!this.animationQueue.length || this.isStopped) return;

        const currentItem = this.animationQueue[0];
        currentItem.animations.forEach(([prop, target, duration]) => {
            if (prop === 'opacity') {
                this.animateOpacity(target, duration);
            } else {
                this.animateProperty(prop, target, duration);
            }
        });
    }

    private animateProperty(prop: string, target: string | number, duration: number): void {
        const start = parseFloat(this.element.style[prop as any]) || 0;
        const [value, unit] = this.parseTargetValue(target, start);
        this.animateValue({
            prop,
            start,
            target: value,
            unit,
            duration,
            update: (val: number) => {
                this.element.style[prop as any] = `${val}${unit}`;
            }
        });
    }

    private animateOpacity(target: string | number, duration: number): void {
        const currentOpacity = parseFloat(this.element.style.opacity) ||
            parseFloat(window.getComputedStyle(this.element).opacity) || 1;
        const [value] = this.parseTargetValue(target, currentOpacity);

        this.animateValue({
            prop: 'opacity',
            start: currentOpacity,
            target: value,
            unit: '',
            duration,
            update: (val: number) => {
                this.element.style.opacity = `${val}`;
            }
        });
    }

    private parseTargetValue(target: string | number, currentValue: number): [number, string] {
        const regex = /^([+\-*/]=?)\s*(-?\d+\.?\d*)(.*)/;
        const match = String(target).match(regex);

        if (!match) {
            // %字符串分割
            if (typeof target === "string" && target.endsWith("%")) {
                return [Number(target.substring(0, target.length - 1)), "%"]
            }
            return [Number(target), ''];
        }

        const [_, operator, numStr, unit] = match;
        const num = parseFloat(numStr);

        switch (operator) {
            case '+=': return [currentValue + num, unit];
            case '-=': return [currentValue - num, unit];
            case '*=': return [currentValue * num, unit];
            case '/=': return [currentValue / num, unit];
            default: return [num, unit];
        }
    }

    private animateValue(config: {
        prop: string;
        start: number;
        target: number;
        unit: string;
        duration: number;
        update: (value: number) => void;
    }): void {
        const startTime = Date.now();
        const delta = config.target - config.start;

        const step = () => {
            if (this.isStopped) return;

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / config.duration, 1);
            const currentValue = this.easeInOutQuad(progress, config.start, delta, 1);

            config.update(currentValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                this.checkQueueCompletion();
            }
        };

        requestAnimationFrame(step);
    }

    private easeInOutQuad(t: number, b: number, c: number, d: number): number {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }

    private checkQueueCompletion(): void {
        this.currentStep++;
        if (this.currentStep >= (this.animationQueue[0]?.animations.length || 0)) {
            this.currentStep = 0;
            this.animationQueue[0]?.callback?.();
            this.animationQueue.shift();
            this.processQueue();
        }
    }
}