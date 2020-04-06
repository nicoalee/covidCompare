import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "truncate"
})
export class Truncate implements PipeTransform {
    transform(value: string) {

        if(value.length <= 150) {
            return value
        } else {
            return `${value.slice(0, 150)}...`
        }
    }
    
}