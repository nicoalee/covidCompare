import { Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
    selector: '[pastelColor]'
})
export class PastelColorDirective {

    constructor(elementRef: ElementRef, renderer: Renderer2) {
        renderer.setStyle(elementRef.nativeElement, 'backgroundColor', this.getPastelColor())
    }

    getPastelColor() { 
        return "hsl(" + 360 * Math.random() + ',' +
                    (25 + 70 * Math.random()) + '%,' + 
                    (85 + 10 * Math.random()) + '%)'
    }

}