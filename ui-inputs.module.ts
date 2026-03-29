import { NgModule } from '@angular/core';
import { InputLabelErrorComponent } from './input-label-error/input-label-error.component';

/**
 * UiInputsModule — re-exports all components in the ui-inputs library.
 * Import this in any NgModule-based app or feature module.
 */
@NgModule({
  imports: [InputLabelErrorComponent],
  exports: [InputLabelErrorComponent],
})
export class UiInputsModule {}
