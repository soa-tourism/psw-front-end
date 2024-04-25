import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-application-grade',
  templateUrl: './application-grade.component.html',
  styleUrls: ['./application-grade.component.css']
})
export class ApplicationGradeComponent implements OnInit {

  user: User | undefined;
  now: Date = new Date();
  
  constructor(private service: AdministrationService, 
              private authService: AuthService,
              private router : Router) { }
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  applicationGradeForm = new FormGroup({
    Rating: new FormControl(1, [Validators.required]),
    Comment: new FormControl(''),
    Created: new FormControl(),
    UserId: new FormControl()
  })

  noteTheRate(): void {
    const formData = this.applicationGradeForm.value;
  
    this.service.noteTheRate({
      rating: formData.Rating || 1,
      comment: formData.Comment || "",
      created: new Date(this.now.getUTCFullYear(), this.now.getUTCMonth(), this.now.getUTCDate(), this.now.getUTCHours(), this.now.getUTCMinutes(), this.now.getUTCSeconds()),
      userId: this.user?.id || -1
    }).subscribe({
      next: (_) => {
        alert("App rate added successufully!");
        this.applicationGradeForm.reset();
        this.router.navigate(['/home']);
      }
    });
  }
}
