import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusiness } from '../business.model';

@Component({
  selector: 'jhi-business-detail',
  templateUrl: './business-detail.component.html',
})
export class BusinessDetailComponent implements OnInit {
  business: IBusiness | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ business }) => {
      this.business = business;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
