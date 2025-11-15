import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { PollutionDetailsComponent } from "./pollution-details/pollution-details.component";
import { PollutionListComponent } from "./pollution-list/pollution-list.component";
import { UserModule } from './user/user.module';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, PollutionDetailsComponent, PollutionListComponent, UserModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tp03';
  loggedIn = true;

  constructor(private router: Router, private userService: UserServiceService) {}
  
  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
  }
}
