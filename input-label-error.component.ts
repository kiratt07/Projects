import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';

/** Auto-incrementing counter — guarantees unique IDs across all instances */
let nextId = 0;

/**
 * InputLabelErrorComponent
 *
 * Fluent UI–styled standalone text input with label + error message.
 * Angular 19 compatible. WCAG 2.1 AA accessible.
 *
 * @example
 * <app-input-label-error
 *   label="Email address"
 *   size="large"
 *   [width]="300"
 *   placeholder="you@domain.com"
 *   type="email"
 *   [(value)]="email"
 *   [errorMessage]="emailError"
 *   (keyup)="onEmailKeyup($event)"
 *   (blur)="validateEmail()">
 * </app-input-label-error>
 */
@Component({
  selector: 'app-input-label-error',
  standalone: true,
  imports: [],                      // No CommonModule — uses Angular 17+ @if syntax
  templateUrl: './input-label-error.component.html',
  styleUrls: ['./input-label-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputLabelErrorComponent implements OnChanges, AfterViewInit {

  // ─── Inputs ────────────────────────────────────────────────────────────────

  /** Text displayed above the input. */
  @Input() label: string = '';

  /**
   * Height variant.
   * small → 24 px | medium → 28 px (default) | large → 32 px
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /** Width of the whole component. Number = px, string = any CSS value. */
  @Input() width: string | number = '100%';

  /** Native placeholder attribute. */
  @Input() placeholder: string = '';

  /** Native input type (text, email, password, …). */
  @Input() type: string = 'text';

  /** Two-way bound value — use [(value)]="myVar". */
  @Input() value: string = '';

  /** Disabled state. */
  @Input() disabled: boolean = false;

  /**
   * When non-null the error text is shown below the input and border turns red.
   * Set back to null to clear the error state.
   */
  @Input() errorMessage: string | null = null;

  /** Focus the input immediately after the component renders. */
  @Input() autoFocus: boolean = false;

  /** HTML autocomplete attribute (e.g. 'email', 'off'). */
  @Input() autocomplete: string = 'off';

  /**
   * Overrides the auto-generated aria-label.
   * Useful when the visible label isn't descriptive enough for screen readers.
   */
  @Input() ariaLabel: string | null = null;

  // ─── Outputs ───────────────────────────────────────────────────────────────

  /** Emits the string value on every user keystroke. Mirrors [(ngModel)]. */
  @Output() valueChange = new EventEmitter<string>();

  /** Re-emits the native KeyboardEvent on every key-up. */
  @Output() keyup = new EventEmitter<KeyboardEvent>();

  /** Emitted when the input loses focus — use for on-blur validation. */
  @Output() blur = new EventEmitter<FocusEvent>();

  /** Emitted when the input gains focus. */
  @Output() focus = new EventEmitter<FocusEvent>();

  // ─── ViewChild ─────────────────────────────────────────────────────────────

  @ViewChild('inputRef') private inputRef!: ElementRef<HTMLInputElement>;

  // ─── HostBindings ──────────────────────────────────────────────────────────

  /** Applies width directly on the host element. */
  @HostBinding('style.width')
  get hostWidth(): string {
    return typeof this.width === 'number' ? `${this.width}px` : this.width;
  }

  /** Adds a CSS hook class when disabled. */
  @HostBinding('class.ile--disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  readonly inputId: string;
  readonly errorId:  string;

  constructor(private cdr: ChangeDetectorRef) {
    const id    = nextId++;
    this.inputId = `ile-input-${id}`;
    this.errorId  = `ile-error-${id}`;
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorMessage'] || changes['disabled']) {
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      // Defer so the browser paint finishes first.
      setTimeout(() => this.focus(), 0);
    }
  }

  // ─── DOM event handlers ────────────────────────────────────────────────────

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.valueChange.emit(val);
  }

  onKeyup(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.blur.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  // ─── Public API — spec §3.3 ────────────────────────────────────────────────

  /**
   * focus(): void
   * Programmatically focuses the native <input>.
   * Call this from a parent via @ViewChild.
   */
  focus(): void {
    this.inputRef?.nativeElement?.focus();
  }

  /**
   * setError(message: string | null): void
   * Programmatically sets or clears the error message.
   * Equivalent to pushing a new [errorMessage] from the parent.
   */
  setError(message: string | null): void {
    this.errorMessage = message;
    this.cdr.markForCheck();
  }
}
