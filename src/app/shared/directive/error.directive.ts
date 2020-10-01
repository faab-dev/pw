import {
  Directive,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ContentChild
} from '@angular/core';
import { NgControl } from '@angular/forms';

import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CustomMatErrorComponent} from '../component/mat-error/custom-mat-error.component';

export const defaultErrors = {
  minlength: ({ requiredLength, actualLength }) =>
    `Expect ${requiredLength} but got ${actualLength}. `,
  email: error => 'The email is incorrect. ',
  error: error => error,
  required: error => `This field is required. `,
  isMatching: error => 'Confirm password is not matched with password. '
};

@Directive({
  selector: '[appMongoIndexLimit]'
})
export class MongoIndexLimitDirective implements AfterViewInit {
  ref: ComponentRef<CustomMatErrorComponent>;
  control: NgControl;
  @ContentChild(MatInput, { read: ElementRef }) controlElementRef: ElementRef;
  constructor(
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private formField: MatFormField,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  public ngAfterViewInit(): void {
    this.control = this.formField._control.ngControl;
    this.renderer.listen(this.controlElementRef.nativeElement, 'blur', () =>
      this.onChange(null)
    );
    this.control.statusChanges.subscribe(res => this.onChange(res));
  }

  public onChange(res): void {
    if (this.control.invalid && this.control.touched) {

      let error: string = this.formField._control.placeholder + ' incorrect';

      /*if (this.formField._control.placeholder === 'Confirm password') {
        debugger;
      }*/
      Object.keys(defaultErrors).forEach(k => {
        console.log(k, this.control.hasError(k), this.control.errors[k]);
        if (this.control.hasError(k)) { error = defaultErrors[k](this.control.errors[k]); }
      });
      this.setError(error);
    } else { this.setError(''); }
  }
  setError(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(CustomMatErrorComponent);
      this.formField._elementRef;
      this.ref = this.vcr.createComponent(factory);
    }
    this.ref.instance.error = text;
  }
}
