import {AfterViewInit, Directive, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

// base component with helping methods

// Why '@Directive' decorator?
// Fix https://github.com/angular/angular/issues/35367#issuecomment-585136872
@Directive()
export class SeparatedBaseComponent implements OnInit, OnDestroy, AfterViewInit  {
  ngOnInit(): void {
    this.onInit();
  }

  onInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  onDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.afterViewInit();

  }

  afterViewInit(): void {
  }

  protected checkSubscription(subscription: Subscription): void {
    if (!subscription || typeof subscription.unsubscribe !== 'function') {
      return;
    }
    subscription.unsubscribe();
  }
}
