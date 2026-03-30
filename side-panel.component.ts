import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

/**
 * SidePanelComponent
 *
 * Fluent UI–styled side panel (drawer).
 * Slides in from left or right, overlays page with a dimmed backdrop.
 *
 * @example
 * <app-side-panel
 *   [isOpen]="panelOpen"
 *   title="Edit Profile"
 *   position="right"
 *   width="380px"
 *   primaryLabel="Save"
 *   secondaryLabel="Cancel"
 *   (closed)="panelOpen = false"
 *   (primaryAction)="onSave()">
 *
 *   <p>Your body content here</p>
 *
 * </app-side-panel>
 */
@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnChanges {

  // ─── Inputs ────────────────────────────────────────────────────────────────

  /** Controls whether the panel is open or closed. */
  @Input() isOpen: boolean = false;

  /** Title shown in the panel header. */
  @Input() title: string = '';

  /** Which side the panel slides in from. */
  @Input() position: 'left' | 'right' = 'right';

  /** Width of the panel — any CSS value e.g. '320px', '40%'. */
  @Input() width: string = '320px';

  /** Primary footer button label. Set to '' to hide. */
  @Input() primaryLabel: string = 'Save';

  /** Secondary footer button label. Set to '' to hide. */
  @Input() secondaryLabel: string = 'Cancel';

  /** Close the panel when the backdrop is clicked. */
  @Input() closeOnBackdrop: boolean = true;

  // ─── Outputs ───────────────────────────────────────────────────────────────

  /** Fires when panel should close (X button, Escape key, backdrop click). */
  @Output() closed = new EventEmitter<void>();

  /** Fires when the primary (Save) button is clicked. */
  @Output() primaryAction = new EventEmitter<void>();

  /** Fires when the secondary (Cancel) button is clicked. */
  @Output() secondaryAction = new EventEmitter<void>();

  // ─── Internal ──────────────────────────────────────────────────────────────

  /** Keeps panel in DOM during closing animation, then removes it. */
  isVisible: boolean = false;

  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.openPanel();
      } else {
        this.closePanel();
      }
    }
  }

  // ─── Keyboard ──────────────────────────────────────────────────────────────

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.requestClose();
    }
  }

  // ─── Open / Close ──────────────────────────────────────────────────────────

  private openPanel(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  private closePanel(): void {
    this.closeTimer = setTimeout(() => {
      this.isVisible = false;
      document.body.style.overflow = '';
      this.cdr.markForCheck();
    }, 300);
  }

  // ─── Event handlers ────────────────────────────────────────────────────────

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.requestClose();
    }
  }

  requestClose(): void {
    this.closed.emit();
  }

  onPrimaryClick(): void {
    this.primaryAction.emit();
  }

  onSecondaryClick(): void {
    this.secondaryAction.emit();
    this.requestClose();
  }
}
