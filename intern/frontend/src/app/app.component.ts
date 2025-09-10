import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="header">
      <div class="container header__inner">
        <div class="brand">Issue Tracker</div>
        <div class="muted">Manage issues professionally</div>
      </div>
    </header>

    <div class="container">
      <h1>Dashboard</h1>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}

