import { Component, OnInit, ViewChild } from '@angular/core';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
// import { VinInfoService } from '../../core/services/vin-info/vin-info.service';
import { MatSort, MatTableDataSource } from '@angular/material';
// import { VehicleData } from '../../shared/interfaces/VehicleData';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-view-claims-new',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease-in')),
    ]),
  ],
})
export class ViewClaimsComponent implements OnInit {
  // vehicleData: VehicleData | null = null;
  dataSource = new MatTableDataSource<Protos.Claim>([]);
  expandedElement: Protos.Claim | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  columnsToDisplay = [
    'status',
    'vin',
    'insuranceName',
    'gap',
    'modified',
    'created',
  ];

  constructor(
    private middlewareService: MiddlewareService, // private service: VinInfoService,
  ) {}

  ngOnInit() {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.dataSource.data = result;

        this.defaultFilter();

        this.dataSource.sort = this.sort;

        console.log('Claims: ');
        console.log(result);
      },

      error => {
        console.log(error);
      },
    );
  }

  sortClaims(num: any) {
    console.log(num);
    this.defaultFilter();

    this.dataSource.filter = num.toString();
  }

  applyVinFilter(vin: string) {
    this.dataSource.filterPredicate = (claim, filter) => {
      return claim.vehicle.vin.indexOf(filter) !== -1;
    };

    this.dataSource.filter = vin.trim();

    if (this.dataSource.filter.length === 0) {
      this.defaultFilter();
    }
  }

  defaultFilter(): void {
    this.dataSource.filterPredicate = (claim, filter) => {
      console.log(+filter);
      return claim.status === +filter;
    };

    this.dataSource.filter = '0';
  }

  /* getVehicleModel(vin: string) {
    this.service.getVinData(vin).subscribe(
      result => {
        if (result) {
          this.vehicleData.model = result.Model;
          this.vehicleData.modelYear = result.ModelYear;
          this.vehicleData.basePrice = result.BasePrice;
          console.log(this.vehicleData);
        }
      },
      error => {
        console.log(error);
      },
    );
  } */
}
