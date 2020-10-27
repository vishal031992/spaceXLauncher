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
}
