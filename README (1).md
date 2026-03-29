# InputLabelError — Build From Scratch Guide

Angular 19 · Fluent UI v9 · Standalone Component · WCAG 2.1 AA

---

## Prerequisites

Make sure you have these installed:

```bash
node --version   # 18 or 20 LTS recommended
npm --version    # 9+
ng version       # Angular CLI 19
```

Install Angular CLI globally if you don't have it:

```bash
npm install -g @angular/cli@19
```

---

## Step 1 — Create the Angular Workspace

```bash
ng new my-workspace --no-create-application --style=scss
cd my-workspace
```

> `--no-create-application` creates a bare workspace — we'll add the library and a demo app separately.

---

## Step 2 — Generate the Library

```bash
ng generate library ui-inputs --prefix=app
```

This creates:

```
projects/
└── ui-inputs/
    └── src/
        ├── lib/            ← your components go here
        └── public-api.ts   ← controls what gets exported
```

---

## Step 3 — Generate the Component

```bash
ng generate component input-label-error \
  --project=ui-inputs \
  --standalone \
  --change-detection=OnPush \
  --style=scss
```

This scaffolds the 4 files inside `projects/ui-inputs/src/lib/input-label-error/`.

---

## Step 4 — Copy the Provided Files

Replace the 4 generated files with the ones provided:

| File | Destination |
|------|-------------|
| `input-label-error.component.ts`   | `projects/ui-inputs/src/lib/input-label-error/` |
| `input-label-error.component.html` | `projects/ui-inputs/src/lib/input-label-error/` |
| `input-label-error.component.scss` | `projects/ui-inputs/src/lib/input-label-error/` |
| `input-label-error.component.spec.ts` | `projects/ui-inputs/src/lib/input-label-error/` |
| `ui-inputs.module.ts`              | `projects/ui-inputs/src/lib/` |
| `public-api.ts`                    | `projects/ui-inputs/src/` |

---

## Step 5 — Update public-api.ts

Open `projects/ui-inputs/src/public-api.ts` and make sure it reads:

```typescript
export { InputLabelErrorComponent } from './lib/input-label-error/input-label-error.component';
export { UiInputsModule }           from './lib/ui-inputs.module';
```

---

## Step 6 — Build the Library

```bash
ng build ui-inputs
```

The compiled output lands in `dist/ui-inputs/`.

---

## Step 7 — Create a Demo App (to test it)

```bash
ng generate application demo-app --style=scss --routing=false
```

Then link the local library:

```bash
# In tsconfig.json at workspace root, paths are already added by Angular CLI:
# "ui-inputs": ["dist/ui-inputs"]
# So just rebuild the library after every change:
ng build ui-inputs --watch
```

In a second terminal:

```bash
ng serve demo-app
```

---

## Step 8 — Use the Component in the Demo App

Open `projects/demo-app/src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { InputLabelErrorComponent } from 'ui-inputs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputLabelErrorComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  email = '';
  emailError: string | null = null;

  onKeyup(event: KeyboardEvent): void {
    const val = (event.target as HTMLInputElement).value;
    this.emailError = val.includes('@') ? null : 'Enter a valid email address';
  }

  validateEmail(): void {
    if (!this.email) {
      this.emailError = 'Email address is required';
    }
  }
}
```

Open `projects/demo-app/src/app/app.component.html`:

```html
<app-input-label-error
  label="Email address"
  size="large"
  [width]="300"
  placeholder="you@domain.com"
  type="email"
  [(value)]="email"
  [errorMessage]="emailError"
  (keyup)="onKeyup($event)"
  (blur)="validateEmail()"
/>
```

---

## Step 9 — Run Unit Tests

```bash
ng test ui-inputs
```

Expected: all 20 unit tests pass.

---

## Step 10 — Lint & Build Final Check

```bash
npm run lint
ng build ui-inputs --configuration production
```

---

## Full File Structure Reference

```
projects/
├── ui-inputs/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── input-label-error/
│   │   │   │   ├── input-label-error.component.ts
│   │   │   │   ├── input-label-error.component.html
│   │   │   │   ├── input-label-error.component.scss
│   │   │   │   └── input-label-error.component.spec.ts
│   │   │   └── ui-inputs.module.ts
│   │   └── public-api.ts
│   └── ng-package.json
└── demo-app/
    └── src/app/
        ├── app.component.ts
        └── app.component.html
```

---

## API Quick Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | `''` | Text above the input |
| `size` | `'small'│'medium'│'large'` | `'medium'` | Height: 24/28/32 px |
| `width` | `string │ number` | `'100%'` | e.g. `300` or `'50%'` |
| `placeholder` | `string` | `''` | Native placeholder |
| `type` | `string` | `'text'` | email, password, etc. |
| `value` | `string` | `''` | Use `[(value)]` |
| `disabled` | `boolean` | `false` | Disabled state |
| `errorMessage` | `string │ null` | `null` | Shows red error below |
| `autoFocus` | `boolean` | `false` | Focus on render |
| `autocomplete` | `string` | `'off'` | HTML autocomplete |
| `ariaLabel` | `string │ null` | `null` | Screen reader override |

### Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `valueChange` | `string` | Every keystroke |
| `keyup` | `KeyboardEvent` | Native keyup |
| `blur` | `FocusEvent` | Input lost focus |
| `focus` | `FocusEvent` | Input gained focus |

### Public Methods (via @ViewChild)

| Method | Description |
|--------|-------------|
| `focus()` | Programmatically focus the input |
| `setError(msg)` | Set or clear the error message |
