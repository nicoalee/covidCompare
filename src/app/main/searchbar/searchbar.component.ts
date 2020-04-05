import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { startWith, map } from 'rxjs/operators';
import { CoronaDataService } from 'src/app/services/coronaData.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit, AfterViewInit {

  @ViewChild("auto") matAutocomplete: MatAutocomplete
  @ViewChild("countryInput") countryInput: ElementRef<HTMLInputElement>;

  constructor(
    private _coronaDataService: CoronaDataService, 
    private _loader: LoaderService,
    private _searchService: SearchService) {}

  ngOnInit() {
    this.loadCountries()

    this.selectedCountries = [
      "World"
    ]
  }

  ngAfterViewInit() {
    this._searchService.emitSearched("World");
  }

  countryControl = new FormControl();
  selectedCountries: string[] = []
  countries: string[] = []
  filteredCountries: Observable<string[]>;

  // when matChip indicates the user has clicked the remove button
  onRemovedChip(country: string): void {
    const index = this.selectedCountries.indexOf(country);
    if(index >= 0) {
      this.selectedCountries.splice(index, 1);
      this._searchService.emitRemoved(country);
    }
  }

  // when an item is selected from the dropdown
  selected(event: MatAutocompleteSelectedEvent) {
    let value = event.option.viewValue
    if(!this._isSelected(value)) {
      this.selectedCountries.push(value);                     // add selected item
      this.countryInput.nativeElement.value = "";             // set country input to empty string
      this.countryControl.setValue(null)                      // set form control to null (as opposed to what the entered query was)
      this._searchService.emitSearched(value)
    } else {
      this.countryInput.nativeElement.value = "";
      this.countryControl.setValue(null);
    }
  }

  private _filter(typedValue: string): string[] {
    const caseInsensitiveValue = typedValue.toLowerCase();
    return this.countries.filter(item => item.toLowerCase().indexOf(caseInsensitiveValue) === 0);
  }

  private _isFound(country: string): string {
    return this.countries.find(item => item.toLowerCase() === country.toLowerCase());
  }

  private _isSelected(country: string): string {
    return this.selectedCountries.find(item => item.toLowerCase() === country.toLowerCase());
  }

  onAddChip(event: MatChipInputEvent): void {
    
    const input = event.input;
    const value = event.value;

    // get element that matches our query
    let foundValue = this._isFound(value);
    
    // push to chips if country exists in our list
    if(foundValue) {
      // see if element is in our selected chips already
      let alreadySelected: boolean = !!this._isSelected(foundValue);
      if(!alreadySelected) {
        this.selectedCountries.push(foundValue.trim())
        this._searchService.emitSearched(foundValue.trim())
      }
    }
    // resets input to empty
    if(input) {
      input.value = ''
    }

    // set form control value to null (as opposed to whatever query was entered)
    this.countryControl.setValue(null)
  }

  subscribeToInput() {
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(null),
      map((country: string | null) => {
        return country ? this._filter(country) : this.countries.slice()
      })
    )
  }

  loadCountries() {

    this._coronaDataService.getCountries().subscribe(
      (data: string[]) => {
        this.countries = data

        this.subscribeToInput()
      },
      (err) => {
        throw new Error("err")
      }
    )
  }
}
