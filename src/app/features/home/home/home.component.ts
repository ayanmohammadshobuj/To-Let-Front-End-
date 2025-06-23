import { Component } from '@angular/core';
import { AuthService } from '../../../core/authentication/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {CurrencyPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
// export class HomeComponent implements OnInit, OnDestroy {
export class HomeComponent {
  isAuthenticated = false;
  private authSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   // Removed redundant call to populate()
  //   this.authSubscription = this.authService.isAuthenticated.subscribe(
  //     (authenticated) => {
  //       this.isAuthenticated = authenticated;
  //     }
  //   );
  // }

  // ngOnDestroy(): void {
  //   // Clean up subscription
  //   if (this.authSubscription) {
  //     this.authSubscription.unsubscribe();
  //   }
  // }
  //
  // login(): void {
  //   this.router.navigate(['/login']);
  // }
  //
  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
}
