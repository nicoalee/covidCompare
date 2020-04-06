import { Component, OnInit, HostListener } from '@angular/core';
import { CoronaDataService } from 'src/app/services/coronaData.service';
import { SearchService } from 'src/app/services/search.service';
import { Series } from '../dtos';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @HostListener("window:resize", ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.resizeGraph()
  }

  innerWidth: number

  // metadata
  view: any[] = [1200,500]
  multi: any[] = [];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Cases';
  timeline: boolean = true;

  constructor(private _searchService: SearchService, private _coronaDataService: CoronaDataService, private _loaderService: LoaderService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth
    this.resizeGraph()
    this.subscribeToSearch()
    this.subscribeToRemove()
  }

  selected: string = "cases";

  onChange(event) {
    console.log(event.value);

  }

  subscribeToSearch() {
    this._loaderService.show()
    this._searchService.emitSearchResults.subscribe(
      (country: string) => {
        this._coronaDataService.getCasesByCountry(country).subscribe((data: Series) => {
          this._loaderService.hide()
          this.multi.push(data)
          this.multi = [...this.multi]
        })
      },
      (err) => {
        throw new Error(err)
      }
    )
  }

  subscribeToRemove() {
    this._searchService.emitRemoveResult.subscribe(
      (country: string) => {
        const index = this.multi.findIndex(item => item.name === country)
        this.multi.splice(index, 1);
        this.multi = [...this.multi]
      },
      (err) => {
        throw new Error(err)
      }
    )
  }

  resizeGraph() {
    if(this.innerWidth > 1500) {
      this.legend = true;
      this.view = [1200, 500]
    } else if(this.innerWidth > 1200) {
      this.legend = true;
      this.view = [950, 500]
    } else if(this.innerWidth > 992) {
      this.legend = true;
      this.view = [950, 450]
    } else if(this.innerWidth > 768) {
      this.legend = true;
      this.view = [770, 400]
    } else if(this.innerWidth > 600) {
      this.legend = true;
      this.view = [600, 350]
    } else if(this.innerWidth <= 600) {
      this.legend = false;
      this.view = [370, 300]
    }
  }

  onSelect(event) {

  }
}
