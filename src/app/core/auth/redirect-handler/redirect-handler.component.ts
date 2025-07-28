import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  template: '',
  standalone:true


})
export class RedirectHandlerComponent {
private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role?.toLowerCase().includes('admin')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user) {
      this.router.navigate(['/student/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
