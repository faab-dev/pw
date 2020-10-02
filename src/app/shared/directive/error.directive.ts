import {
  Directive,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ContentChild, SimpleChange
} from '@angular/core';
import { NgControl } from '@angular/forms';

import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CustomMatErrorComponent} from '../component/mat-error/custom-mat-error.component';

export const defaultErrors: {[key: string]: (arg: any) => string} = {
  minlength: ({ requiredLength, actualLength }) => {
    return 'Expect ' + requiredLength + ' but got ' + actualLength + '. ';
  },
  email: error => 'The email is incorrect. ',
  error: error => error as string,
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
    this.renderer.listen(this.controlElementRef.nativeElement, 'blur', () =>
      this.onChange(null)
    );
    const control = this.formField._control.ngControl;
    if (!control) {
      return;
    }
    this.control = control;

    if (!this.control.statusChanges) {
      return;
    }
    this.control.statusChanges.subscribe(res => this.onChange(res));
  }

  public onChange(res: any): void {
    if (this.control.invalid && this.control.touched) {

      let error: string = this.formField._control.placeholder + ' incorrect';
      Object.keys(defaultErrors).forEach((k: string) => {
        if (this.control.errors) {
          console.log(k, this.control.hasError(k), this.control.errors[k]);
        }
        if (
          this.control.hasError(k)
          && this.control.errors
        ) {
          if (
            typeof defaultErrors === 'object'
            && typeof defaultErrors[k] === 'function'
          ) {
            error = defaultErrors[k](this.control.errors[k]);
          }
          /*if (typeof defaultErrors[k] === 'string') {

          }*/

        }
      });
      this.setError(error);
    } else { this.setError(''); }
  }
  setError(text: string): void {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(CustomMatErrorComponent);
     // this.formField._elementRef;
      this.ref = this.vcr.createComponent(factory);
    }
    this.ref.instance.error = text;
  }
}
