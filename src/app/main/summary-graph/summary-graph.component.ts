import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { CoronaDataService } from 'src/app/services/coronaData.service';
import { CountryPop, Series } from '../dtos';

@Component({
  selector: 'app-summary-graph',
  templateUrl: './summary-graph.component.html',
  styleUrls: ['./summary-graph.component.css']
})
export class SummaryGraphComponent implements OnInit {

  countries: CountryPop[] = [];

  constructor(private _searchService: SearchService, private _coronaDataService: CoronaDataService) { }

  ngOnInit(): void {
    this.getSearchResults()
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
