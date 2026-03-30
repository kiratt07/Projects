import { Component } from '@angular/core';
import { SidePanelComponent } from 'ui-panels';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidePanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  panelOpen = false;
  panelPosition: 'left' | 'right' = 'right';

  // Editable fields inside the panel
  name  = '';
  email = '';

  openPanel(position: 'left' | 'right'): void {
    this.panelPosition = position;
    this.panelOpen = true;
  }

  onSave(): void {
    alert(`Saved!\nName: ${this.name}\nEmail: ${this.email}`);
    this.panelOpen = false;
  }
}
