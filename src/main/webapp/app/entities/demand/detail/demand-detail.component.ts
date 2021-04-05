import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDemand } from '../demand.model';

@Component({
  selector: 'jhi-demand-detail',
  templateUrl: './demand-detail.component.html',
})
export class DemandDetailComponent implements OnInit {
  demand: IDemand | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ demand }) => {
      this.demand = demand;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
