import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputLabelErrorComponent } from './input-label-error.component';

describe('InputLabelErrorComponent', () => {
  let component: InputLabelErrorComponent;
  let fixture: ComponentFixture<InputLabelErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputLabelErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputLabelErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Label ─────────────────────────────────────────────────────────────────

  it('should render label when label input is provided', () => {
    component.label = 'Email';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.ile-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Email');
  });

  it('should NOT render label element when label is empty', () => {
    component.label = '';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ile-label'))).toBeNull();
  });

  it('should associate label [for] with input [id]', () => {
    component.label = 'Name';
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.debugElement.query(By.css('.ile-label')).nativeElement;
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(label.htmlFor).toBe(input.id);
  });

  // ── Size mapping ──────────────────────────────────────────────────────────

  it('should apply ile-input--small for size small', () => {
    component.size = 'small';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
      .toContain('ile-input--small');
  });

  it('should apply ile-input--medium by default', () => {
    expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
      .toContain('ile-input--medium');
  });

  it('should apply ile-input--large for size large', () => {
    component.size = 'large';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
      .toContain('ile-input--large');
  });

  // ── Width ─────────────────────────────────────────────────────────────────

  it('should return "100%" as default hostWidth', () => {
    expect(component.hostWidth).toBe('100%');
  });

  it('should convert numeric width to px string', () => {
    component.width = 300;
    expect(component.hostWidth).toBe('300px');
  });

  it('should pass through string width unchanged', () => {
    component.width = '50%';
    expect(component.hostWidth).toBe('50%');
  });

  // ── Error state ───────────────────────────────────────────────────────────

  it('should NOT show error div when errorMessage is null', () => {
    component.errorMessage = null;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ile-error'))).toBeNull();
  });

  it('should show error div when errorMessage is set', () => {
    component.errorMessage = 'Invalid email';
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('.ile-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Invalid email');
  });

  it('should add ile-input--error class when errorMessage is set', () => {
    component.errorMessage = 'Oops';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
      .toContain('ile-input--error');
  });

  it('should set aria-invalid="true" when errorMessage is set', () => {
    component.errorMessage = 'Required';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby pointing at the error div', () => {
    component.errorMessage = 'Required';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const errorDiv: HTMLElement   = fixture.debugElement.query(By.css('.ile-error')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe(errorDiv.id);
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  it('should disable native input when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.disabled).toBeTrue();
  });

  it('should set aria-disabled="true" when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  // ── Events ────────────────────────────────────────────────────────────────

  it('should emit valueChange on input event', () => {
    const spy = jasmine.createSpy('valueChange');
    component.valueChange.subscribe(spy);
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('should emit keyup on keyup event', () => {
    const spy = jasmine.createSpy('keyup');
    component.keyup.subscribe(spy);
    fixture.debugElement.query(By.css('input'))
      .triggerEventHandler('keyup', new KeyboardEvent('keyup', { key: 'a' }));
    expect(spy).toHaveBeenCalled();
  });

  it('should emit blur on blur event', () => {
    const spy = jasmine.createSpy('blur');
    component.blur.subscribe(spy);
    fixture.debugElement.query(By.css('input'))
      .triggerEventHandler('blur', new FocusEvent('blur'));
    expect(spy).toHaveBeenCalled();
  });

  it('should emit focus on focus event', () => {
    const spy = jasmine.createSpy('focus');
    component.focus.subscribe(spy);
    fixture.debugElement.query(By.css('input'))
      .triggerEventHandler('focus', new FocusEvent('focus'));
    expect(spy).toHaveBeenCalled();
  });

  // ── setError() ────────────────────────────────────────────────────────────

  it('should show error after calling setError()', () => {
    component.setError('Something went wrong');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ile-error'))).toBeTruthy();
  });

  it('should clear error after calling setError(null)', () => {
    component.errorMessage = 'old error';
    fixture.detectChanges();
    component.setError(null);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ile-error'))).toBeNull();
  });

  // ── ariaLabel ─────────────────────────────────────────────────────────────

  it('should set aria-label when ariaLabel input is provided', () => {
    component.ariaLabel = 'Custom label for screen reader';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.getAttribute('aria-label')).toBe('Custom label for screen reader');
  });
});
