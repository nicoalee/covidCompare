import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Papa, ParseResult } from 'ngx-papaparse'
import { Series } from '../main/dtos';

@Injectable({
    providedIn: "root"
})
export class CoronaDataService {
    
    constructor(private _http: HttpClient, private _papa: Papa) {}

    private _jhuGitUrl: string = environment.jhuGitUrl;
    private _jhuGitCases: string = environment.jhuGitCases;
    private _jhuGitDeaths: string = environment.jhuGitDeaths;
    private _jhuGitRecovered: string = environment.jhuGitRecovered;

    getCountries(): Observable<any> {
        return this._http.get(`${this._jhuGitUrl}${this._jhuGitCases}`, {responseType: "text"}).pipe(
            map(arr => this._papa.parse(arr)),
            map((arr: ParseResult) => 
                arr.data.map((item: string[]) => item.slice(1)
                ).slice(1)  // remove first Province/state row
            ),
            map(arr => this._findUniqueCountries(arr))
        )
    }

    private _findUniqueCountries(arr: string[][]) {
        let tempSet = new Set();

        arr.forEach(country => {
            if( country.length > 0 && 
                !tempSet.has(country[0]) &&
                country[0] !== "MS Zaandam" &&
                country[0] !== "Diamond Princess"
            ) {
                if(country[0] === "Taiwan*") {
                    // correct Taiwan
                    tempSet.add("Taiwan")
                } else {
                    tempSet.add(country[0])
                }
            }
        })
        tempSet.add("World")
        return Array.from(tempSet)
    }

    getCasesByCountry(country: string): Observable<Series> {
        if(country === "Taiwan") country = "Taiwan*"
        return this._http.get(`${this._jhuGitUrl}${this._jhuGitCases}`, {responseType: "text"}).pipe(
            map(arr => this._papa.parse(arr)),
            map((arr: ParseResult) => this.formatData(arr, country))
        )
    }

    formatData(arr: ParseResult, countrySelected: string): Series {

        
        if(arr.data[arr.data.length - 1][0] === "") arr.data.pop();         // remove last item if its empty

        // special aggregation for world
        if(countrySelected === "World") return this._returnWorldAggregation(arr.data)
        
        let dates = arr.data[0].slice(4);                                   // get first element of arr

        // find all instances of the country we are looking for
        const selectedCases = arr.data.filter((item: string[]) => item[1].toLowerCase() === countrySelected.toLowerCase())

        let resultingAggregation: number[] = this._aggregate(selectedCases);

        return {
            name: (countrySelected === "Taiwan*" ? "Taiwan" : countrySelected),
            series: this._createSeries(dates, resultingAggregation)
        }
    }

    private _createSeries(arr: string[], aggregation: number[]): {name: string, value: number}[] {

        let seriesArr: {name: string, value: number}[] = []

        for(let i = 0; i < arr.length; i++) {
            seriesArr.push({
                name: arr[i],
                value: aggregation[i]
            })
        }
        return seriesArr;
    }

    private _returnWorldAggregation(arr: string[][]): Series {
        let dates = arr[0].slice(4);            // retain dates
        arr = arr.slice(1);                     // have to remove first element as that has dates

        let aggregation: number[] = this._aggregate(arr);

        return {
            name: "World",
            series: this._createSeries(dates, aggregation)
        }
        
    }

    // given an array of arrays full of figures in different parts of the country,
    // this function aggregates it into one
    private _aggregate(arr: string[][]): number[] {

        let aggregatedArr: number[] = new Array<number>(arr[0].length - 4).fill(0);

        arr.forEach((tempArr: string[]) => {
            tempArr = tempArr.slice(4);
            
            for(let i = 0; i < tempArr.length; i++) {
                aggregatedArr[i] = aggregatedArr[i] + parseInt(tempArr[i])
            }
        })
        return aggregatedArr
    }





}