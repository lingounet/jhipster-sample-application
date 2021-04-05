import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRole } from '../role.model';
import { RoleService } from '../service/role.service';
import { RoleDeleteDialogComponent } from '../delete/role-delete-dialog.component';

@Component({
  selector: 'jhi-role',
  templateUrl: './role.component.html',
})
export class RoleComponent implements OnInit {
  roles?: IRole[];
  isLoading = false;

  constructor(protected roleService: RoleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.roleService.query().subscribe(
      (res: HttpResponse<IRole[]>) => {
        this.isLoading = false;
        this.roles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRole): number {
    return item.id!;
  }

  delete(role: IRole): void {
    const modalRef = this.modalService.open(RoleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.role = role;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
