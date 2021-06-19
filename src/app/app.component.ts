import { Component } from '@angular/core';
import { ProgramFilter } from '../model/filter';
import { SpaceXLaunchProgramService } from '../services/space-xlaunch-program.service';
import { ToastrService } from 'ngx-toastr';
// import { MatChipInputEvent } from '@angular/material';
// import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  openDialog: boolean = false;
  public numberArray: any = [10, 32, 12, 13];
  post_id: any;


  keywords = [];
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
  allImages: Array<{ Images: any, created_date: any, newsIcon: any, post_title: any, totalComment: any, totalLike: any; auto_id: any, post_image: any, post_thumb_image: any }> = Array<{ Images: any, created_date: any, newsIcon: any, post_title: any, totalComment: any, totalLike: any, auto_id: any, post_image: any, post_thumb_image: any }>();
  allVideos: Array<{ post_image: any, post_thumb_image: any, created_date: any, commentMessage: any, post_title: any, submittedReportMessage: any,likedImage:any,reportingStatus:any,showReport:any }> = Array<{ post_image: any, post_thumb_image: any, created_date: any, commentMessage: any, post_title: any, submittedReportMessage: any,likedImage:any,reportingStatus:any,showReport:any }>();

  imageLink: any;

  constructor(private service: SpaceXLaunchProgramService, private tostrService: ToastrService) {
    this.programFilter = new ProgramFilter
  }
  ngOnInit() {

    this.isLoading = false
    this.getAllSpaceXProgram();
    this.GetAllPost();
    // this.GetAllDetail();

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
  GetAllPost() {
    const post = {
      "client_id": "CO-33",
      "empcode": "2",
      "device": "2",
      "deviceId": "browser",
      "app_version": "28",
      "value": 0

    }
    this.service.GetAllPost(post).subscribe(res => {
      const response = JSON.parse(JSON.stringify(res));
      let data = response.data;

      data.forEach(element => {
        this.allImages.push({ Images: element.Images, created_date: element.created_date, newsIcon: element.newsIcon, post_title: element.post_title, totalComment: element.totalComment, totalLike: element.totalLike, auto_id: element.auto_id, post_image: element.Images_orig[0].post_image, post_thumb_image: element.Images_orig[0].post_thumb_image })
      });
      this.title = response.title
    });
  }
  GetAllDetail() {
    this.allVideos = [];
    const detail = {
      "client_id": "CO-33",
      "employee_id": "2",
      "device": "2",
      "device_id": "browser",
      "app_version": "28",
      "post_id": this.post_id,
      "newsType": "1"

    }
    this.service.GetAllDetail(detail).subscribe(res => {
      const response = JSON.parse(JSON.stringify(res));
      let data = response.data;
      this.openDialog = true

      // data.forEach(element => {
      this.allVideos.push({ post_image: data.Images[0].post_image, post_thumb_image: data.Images[0].post_thumb_image, created_date: data.Images[0].created_date, commentMessage: data.commentMessage, post_title: data.post_title, submittedReportMessage: data.submittedReportMessage ,likedImage:data.likedImage,reportingStatus:data.reportingStatus,showReport:data.showReport})
      // });
    });
  }
  open(data) {
    this.post_id = data.auto_id
    this.GetAllDetail()
    // console.log(data);

    // this.openDialog = true;
  }

}

