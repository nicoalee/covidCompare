export class Series {
    name: string;
    series: {
        name: string, value: number
    }[];
}

export class article {
    source: {
        id: string, 
        name: string
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export class CountryPop {
    country: string;
    population: number;
  }