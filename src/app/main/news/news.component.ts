import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/newsService.service';
import { article } from '../dtos';
import { SearchService } from 'src/app/services/search.service';

export class NewsItem {
  country: string;
  articles: article[];
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: NewsItem[] = [];
  selectedCountry: NewsItem = null;
  countries: string[] = [];
  selected: string = "";

  constructor(private _newsService: NewsService, private _searchService: SearchService) { }

  ngOnInit(): void {
    this.getNews()
    this.searchRemoved()
  }

  searchRemoved() {
    this._searchService.emitRemoveResult.subscribe(
      (country: string) => {
        let countriesIndex = this.countries.indexOf(country);
        this.countries.splice(countriesIndex, 1);
        let newsIndex = this.news.findIndex((item: NewsItem) => {
          item.country === country;
        })
        this.news.splice(newsIndex, 1);
      },
      (err) => {
        throw new Error(err)
      })
  }

  getNews() {
    this._searchService.emitSearchResults.subscribe(
      (country: string) => {
        this._newsService.getNews(country)
        .subscribe(
          (data: article[]) => {
            this.news.push({
              country: country,
              articles: data
            })
            this.countries.push(country)
          },
          (err) => {
            throw new Error(err)
          })
      },
      (err) => {
        throw new Error(err)
      })
  }

  onChange(event) {
    let value = event.value;
    this.selectedCountry = this.news.find(item => item.country === value)
  }
}
