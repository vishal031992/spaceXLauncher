import { Component } from '@angular/core';
import { ProgramFilter } from '../model/filter';
import { SpaceXLaunchProgramService } from '../services/space-xlaunch-program.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // launchYear: any;
  public programFilter: ProgramFilter;

  launchYear: Array<{ launch_Year: any, isActive: boolean }> = Array<{ launch_Year: string, isActive: boolean }>();
  successLaunch: Array<{ successLaunch: any, isActive: boolean }> = Array<{ successLaunch: any, isActive: boolean }>();
  successLand: Array<{ successLand: any, isActive: boolean }> = Array<{ successLand: any, isActive: boolean }>();
  isLoading: boolean;
  yearLaunch: string;
  title: string;
  filter: string;
  developerName: string;
  successfulLaunch: string;
  successfulLanding: string;
  noRecordFoundMessage: string;
  launcherDetail: Array<{ imageLink: any, flightNumber: any, missionName: any, missionId: any, launchYear: any, landSuccess: any, launchSuccess: any }> = Array<{ imageLink: any, flightNumber: any, missionName: any, missionId: any, launchYear: any, landSuccess: any, launchSuccess: any }>();

  imageLink: any;

  constructor(private service: SpaceXLaunchProgramService, private tostrService: ToastrService) {
    this.programFilter = new ProgramFilter
  }
  ngOnInit() {
    this.isLoading = false
    this.getAllSpaceXProgram();

  }
  getAllSpaceXProgram() {

    this.isLoading = false;
    this.launcherDetail = [];
    if (this.programFilter.launch_year === undefined) {
      this.programFilter.launch_year = '';
    }
    if (this.programFilter.land_success === undefined) {
      this.programFilter.land_success = '';
    }
    if (this.programFilter.launch_success === undefined) {
      this.programFilter.launch_success = '';
    }
    this.service.allSpaceXProgramList(100, this.programFilter.launch_success, this.programFilter.land_success, this.programFilter.launch_year).subscribe(res => {
      const response = JSON.parse(JSON.stringify(res));
      const launchYear = [...new Set(response.map(item => item.launch_year))];
      launchYear.forEach(element => {
        const isPresent = this.launchYear.filter(n => n.launch_Year === element);
        if (isPresent.length === 0) {
          this.launchYear.push({ launch_Year: element, isActive: false });
        }

      })
      if (this.successLaunch.length === 0) {
        this.successLaunch.push({ successLaunch: 'True', isActive: false });
        this.successLaunch.push({ successLaunch: 'False', isActive: false });
        this.successLand.push({ successLand: 'True', isActive: false });
        this.successLand.push({ successLand: 'False', isActive: false });
        this.yearLaunch = 'Launch Year';
        this.successfulLaunch = 'Successful Launch';
        this.successfulLanding = 'Successfull Landing'
        this.title = 'SpaceX Launch Programs';
        this.filter = 'Filters';
        this.developerName = 'Vishal Verma'
      }
      const links = response.map(item => item.links);
      if (links.length === 0) {
        this.isLoading = true;
        return false;
      }
      links.forEach(element => {
        const detail = response.filter(n => n.links === element).map(n => n);
        const missionId = detail.filter(n => n.links === element).map(n => n.mission_id)
        const year = response.filter(n => n.links === element).map(n => n.launch_year);
        const launchSuccess = response.filter(n => n.links === element).map(n => n.launch_success);

        const land_success = response.filter(n => n.links === element).map(n => n.rocket.first_stage.cores.filter(n => n.core_serial).map(n => n.land_success));

        this.launcherDetail.push({ flightNumber: detail[0].flight_number, imageLink: detail[0].links.mission_patch_small, missionName: detail[0].mission_name, missionId: missionId, launchYear: year[0], landSuccess: land_success[0], launchSuccess: launchSuccess });
        this.isLoading = true;
      });

      localStorage.setItem('PROGRAMS', JSON.stringify(this.launcherDetail));
    })

  }
  clickProgram(e) {
    this.programFilter.launch_year = e.launch_Year;

    if (e.isActive === true) {
      this.programFilter.launch_year = '';
      if (this.programFilter.land_success === '' && this.programFilter.launch_success === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails;
        this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n.isActive = false);
      }
      else if (this.programFilter.land_success !== '' && this.programFilter.launch_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === '' && n.landSuccess === this.programFilter.land_success && n.launchSuccess === this.programFilter.launch_success).map(n => n);
        this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n.isActive = false);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }

      }
      else if (this.programFilter.land_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === '' && n.landSuccess === this.programFilter.land_success).map(n => n);
        this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n.isActive = false);
      } else {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === '' && n.launchSuccess === this.programFilter.launch_success).map(n => n);
        this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n.isActive = false);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }

      }
    } else {
      if (this.programFilter.land_success === '' && this.programFilter.launch_success === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }

      }
      else if (this.programFilter.land_success !== '' && this.programFilter.launch_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year && n.landSuccess.toString() === this.programFilter.land_success.toString() && n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.land_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year && n.landSuccess.toString() === this.programFilter.land_success.toString()).map(n => n);
      } else {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year && n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      this.launchYear.map(n => n.isActive = false);
      const list = this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n);
      if (list[0].isActive === false || list[0].isActive === true) {
        this.launchYear.filter(n => n.launch_Year === e.launch_Year).map(n => n.isActive = true);
      }
    }
  }
  successLaunchEvent(e) {
    if (e.isActive === true) {
      this.successLaunch.map(n => n.isActive = false);
      this.programFilter.launch_success = '';
      // this.getAllSpaceXProgram();
      if (this.programFilter.land_success === '' && this.programFilter.launch_year === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails;
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }

      } else if (this.programFilter.land_success !== '' && this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year && n.landSuccess.toString() === this.programFilter.land_success.toString()).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.land_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.landSuccess === this.programFilter.land_success).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }

    } else {
      this.programFilter.launch_success = e.successLaunch.toLowerCase();
      this.successLaunch.map(n => n.isActive = false);
      if (this.programFilter.land_success === '' && this.programFilter.launch_year === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        this.successLaunch.filter(n => n.successLaunch === e.successLaunch).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      } else if (this.programFilter.land_success !== '' && this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchSuccess.toString() === this.programFilter.launch_success.toString() && n.launchYear === this.programFilter.launch_year && n.landSuccess.toString() === this.programFilter.land_success.toString()).map(n => n);
        this.successLaunch.filter(n => n.successLaunch === e.successLaunch).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      } else if (this.programFilter.land_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchSuccess.toString() === this.programFilter.launch_success.toString() && n.landSuccess.toString() === this.programFilter.land_success.toString()).map(n => n);
        this.successLaunch.filter(n => n.successLaunch === e.successLaunch).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchSuccess.toString() === this.programFilter.launch_success.toString() && n.launchYear === this.programFilter.launch_year).map(n => n);
        this.successLaunch.filter(n => n.successLaunch === e.successLaunch).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }

    }
  }
  successLandEvent(e) {
    if (e.isActive === true) {
      this.successLand.map(n => n.isActive = false);
      this.programFilter.land_success = '';
      if (this.programFilter.launch_success === '' && this.programFilter.launch_year === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails;
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }

      } else if (this.programFilter.launch_success !== '' && this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year && n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.launch_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.launchYear === this.programFilter.launch_year).map(n => n);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }

    } else {

      this.programFilter.land_success = e.successLand.toLowerCase();
      this.successLand.filter(n => n.successLand).map(n => n.isActive = false);
      if (this.programFilter.launch_success === '' && this.programFilter.launch_year === '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.landSuccess.toString() === this.programFilter.land_success.toString()).map(n => n);
        this.successLand.filter(n => n.successLand === e.successLand).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      } else if (this.programFilter.launch_success !== '' && this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.landSuccess.toString() === this.programFilter.land_success.toString() && n.launchYear === this.programFilter.launch_year && n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        this.successLand.filter(n => n.successLand.toString() === e.successLand.toString()).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      } else if (this.programFilter.launch_success !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.landSuccess.toString() === this.programFilter.land_success.toString() && n.launchSuccess.toString() === this.programFilter.launch_success.toString()).map(n => n);
        this.successLand.filter(n => n.successLand === e.successLand).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
      else if (this.programFilter.launch_year !== '') {
        this.launcherDetail = [];
        const programsDetails = JSON.parse(localStorage.getItem('PROGRAMS'));
        this.launcherDetail = programsDetails.filter(n => n.landSuccess.toString() === this.programFilter.land_success.toString() && n.launchYear === this.programFilter.launch_year).map(n => n);
        this.successLand.filter(n => n.successLand === e.successLand).map(n => n.isActive = true);
        if (this.launcherDetail.length === 0) {
          this.noRecordFoundMessage = 'No Records Founds'
        }
      }
    }
  }
}
