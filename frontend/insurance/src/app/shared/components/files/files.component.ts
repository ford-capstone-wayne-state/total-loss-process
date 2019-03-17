import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;

  @Input()
  vin = '';

  @Output()
  updatedClaim = new EventEmitter<Protos.Claim>();

  files: FileList | null = null;

  constructor(
    public dialog: MatDialog
  ) {
    this.updatedClaim.emit(this.claim);
  }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialog, {
      width: '500px',
      data: this.claim,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updatedClaim.emit(result);
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class FileDialog {
  urls = Array<string>();
  success = false;
  updatedClaim: Protos.Claim | undefined;

  constructor(
    public dialogRef: MatDialogRef<FileDialog>,
    private service: MiddlewareService,
    @Inject(MAT_DIALOG_DATA) public data: Protos.Claim,
    @Inject(MAT_DIALOG_DATA) public files: FileList | null,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.files = null;
  }

  updateFileList(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      this.files = event.currentTarget.files;

      // This gets you a preview of the file you're uploading.
      if (this.files !== null) {
        this.urls = [];
        let files = event.currentTarget.files;
        if (files) {
          Array.from(files).forEach(file => {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.urls.push(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        }
      }
    }
  }

  submitFiles(): void {
    if (this.files) {
      this.service
        .addFiles(this.files, this.data.vehicle.vin)
        .subscribe(data => {
          console.log(<Protos.Claim>data);
          this.data = <Protos.Claim>data
          this.files = null;
          this.success = true;
        });
    }
  }
}

@Component({
  selector: 'edit-file-dialog',
  templateUrl: 'edit-file-dialog.html',
})
export class EditFileDialog {
  data!: {file: {name: string, hash: string, status: number}, vin: string};
  success = false;

  successfulArchive = false;
  successfulRestore = false;

  constructor(
    public dialogRef: MatDialogRef<FileDialog>,
    private service: MiddlewareService,
    @Inject(MAT_DIALOG_DATA) public dataObj: {file: {name: string, hash: string, status: number}, vin: string},
  ) {
    this.data = dataObj;
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.successfulArchive = false;
    this.successfulRestore = false;
  }

  archiveFile(): void {
    this.service.archiveFile(this.data.file.name, this.data.vin).subscribe(
      () => {
        this.data.file.status = 1;
        this.successfulArchive = true;
        this.successfulRestore = false;
      }
    );
  }

  restoreFile(): void {
    this.service.restoreFile(this.data.file.name, this.data.vin).subscribe(
      () => {
        this.data.file.status = 0;
        this.successfulRestore = true;
        this.successfulArchive = false;
      }
    );
  }

  downloadFile() {
    this.service.downloadFile(this.data.vin, this.data.file.hash, this.data.file.name).subscribe(blob => {
      const url = URL.createObjectURL(new File([blob], this.data.file.name));
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = this.data.file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
