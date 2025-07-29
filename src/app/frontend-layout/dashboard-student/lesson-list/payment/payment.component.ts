import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule,CurrencyPipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  cardNumber = '';
  cardHolderName = '';
  expiry = '';
  cvv = '';
  price: number = 0;
  title: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.price = nav.extras.state['price'] || 0;
      this.title = nav.extras.state['title'] || 'Lesson';
    }
  }

  onSubmit() {
    Swal.fire({
      title: 'Payment Successful!',
      text: `You have successfully paid ${this.price} EGP for "${this.title}".`,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Go to My Lessons',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/student/my-lessons']);
      }
    });
  }
}
