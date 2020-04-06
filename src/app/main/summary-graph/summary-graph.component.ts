import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { CoronaDataService } from 'src/app/services/coronaData.service';
import { CountryPop, Series } from '../dtos';
import { GraphTypeService } from 'src/app/services/graphType.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-summary-graph',
  templateUrl: './summary-graph.component.html',
  styleUrls: ['./summary-graph.component.css']
})
export class SummaryGraphComponent implements OnInit {

  countries: CountryPop[] = [];

  constructor(
    private _searchService: SearchService, 
    private _coronaDataService: CoronaDataService,
    private _graphTypeService: GraphTypeService
   ) { }

  ngOnInit(): void {
    this.getSearchResults()
    this.getSearchDeleted()
    this.updateSummary()
  }

  updateSummary() {
    this._graphTypeService.emitGraphChange.subscribe(
      (data: string) => {
        this.updateGraph(data)
      })
  }

  updateGraph(str: string) {

    let countries = this.countries.map(country => country.country);
    let tempArr: Observable<Series>[] = []
    
    switch (str) {
      case "cases":
        for(let i = 0; i < countries.length; i++) {
          tempArr.push(this._coronaDataService.getCasesByCountry(countries[i]))
        }
        break;
      case "deaths":
        for(let i = 0; i < countries.length; i++) {
          tempArr.push(this._coronaDataService.getDeathsByCountry(countries[i]))
        }
        break;
      case "recovered":
        for(let i = 0; i < countries.length; i++) {
          tempArr.push(this._coronaDataService.getRecoveredByCountry(countries[i]))
        }
        break;
      default:
        throw new Error("Button option does not exist");
    }
    forkJoin(tempArr)
      .subscribe(
        (data: Series[]) => {
          this.countries.forEach((country, index, theArray) => {
            theArray[index].country = data[index].name
            theArray[index].population = data[index].series[data[index].series.length - 1].value
          })
        },
        (err) => {
          throw new Error(err)
        })
  }

  getSearchResults() {
    this._searchService.emitSearchResults.subscribe(
      (country: string) => {
        this._coronaDataService.getCasesByCountry(country)
          .subscribe(
            (data: Series) => {
              let country = data.name;
              let population = data.series[data.series.length - 1].value;
              this.countries.push({
                country: country,
                population: population
              })
            },
            (err) => {
              throw new Error(err)
            })
      },
      (err) => {
        throw new Error(err)
      })
  }

  getSearchDeleted() {
    this._searchService.emitRemoveResult.subscribe(
      (country: string) => {
        let index = this.countries.findIndex(item => item.country === country);
        this.countries.splice(index, 1);
      }
    )
  }
}
