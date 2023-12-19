import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../utilities/services/http.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService
  ) {
    
  }
  ngOnInit(): void {
    this.httpService.getUsers().subscribe({
      complete: () => {
        console.log('done');
      },
      error: (error) => {
        console.log(error);
      },
      next: (res) => {
        this.users = res
      },
    })
  }

  gotoChat(user: any) {
    const email = localStorage.getItem('userEmail');
    if(email !== user.email) {
      localStorage.setItem('toname', user.username);
      localStorage.setItem('to', user.email);
      this.router.navigate(['/chat']);
    }
  }

  checkYou(user: any) {
    const email = localStorage.getItem('userEmail');
    return email === user.email ? true :  false;
  }
}
