import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpaceXLaunchProgramService {
  public allSpaceXProgramEndpoint = 'https://api.spacexdata.com/v3/launches';

  constructor(private http: HttpClient) { }
  allSpaceXProgramList(limit: any, launch_success, land_success, launch_year) {
    return this.http.get(this.allSpaceXProgramEndpoint + `?limit=${limit}&launch_success=${launch_success}&land_success=${land_success}&launch_year=${launch_year}`)
  }

  GetAllPost(post: any) {
   
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'OUlBV0Z5Y1R2TDNnRjRTVmdMMStTQT09OjqZq1UZPSgSoDXMefyz5L/3'
        })
    };
    // const value = "aa";
    return this.http.post(`https://benepik.org/kpmg/APIs/News/Get_post`,post, httpOptions);
}

GetAllDetail(detail: any) {
   
  const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'OUlBV0Z5Y1R2TDNnRjRTVmdMMStTQT09OjqZq1UZPSgSoDXMefyz5L/3'
      })
  };
  // const value = "aa";
  return this.http.post(`https://benepik.org/kpmg/APIs/News/Post_detail`,detail, httpOptions);
}
}
