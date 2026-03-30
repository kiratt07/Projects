import { Component } from '@angular/core';
import { InputLabelErrorComponent } from 'ui-inputs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputLabelErrorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  email = '';
  emailError: string | null = null;

  onKeyup(event: KeyboardEvent): void {
    const val = (event.target as HTMLInputElement).value;
    this.emailError = val.includes('@') ? null : 'Enter a valid email';
  }

  validateEmail(): void {
    if (!this.email) this.emailError = 'Email is required';
  }
}
