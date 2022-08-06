
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UploadService } from 'src/app/upload-file/upload-file.service';
import { SidebarService } from '../../../navigation/sidebar/sidebar.service';


@Component({
  selector: 'app-dialog-avatar',
  templateUrl: './dialog-username.component.html',
  styleUrls: ['./dialog-username.component.scss']
})
export class DialogUsernameComponent implements OnInit {

  // Variable to store shortLink from api response
  loading: boolean = false; // Flag variable
  file: any = null; // Variable to store file
  errorMsg: string = ""
  editmode: boolean = false;

  // Inject service 
  constructor(private fileUploadService: UploadService,
    public sidebarService: SidebarService,
    public authService: AuthService) { }

  ngOnInit(): void {
  }

  // On file Select
  onChange(event: any) {
    this.editmode = true;
    this.errorMsg = ""
    const ext = event.target.files[0].name.split('.').pop().toLowerCase();
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      this.editmode = false;
      this.errorMsg = "You can only upload a jpg, jpeg or png file."
    }
    else if (event.target.files[0].size > 2000000) {
      this.editmode = false;
      this.errorMsg = "You can only upload a file less than 2MB."
    }
    else {
      this.file = event.target.files[0];
    }
  }

  // OnClick of button Upload
  onUpload() {
    if (this.file == null) {
      return;
    }
    this.loading = !this.loading;
    this.fileUploadService.upload(this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          this.sidebarService.SetImageUrl(event.imagePath)
          this.loading = false; // Flag variable
        }
      }
    );
  }
}
