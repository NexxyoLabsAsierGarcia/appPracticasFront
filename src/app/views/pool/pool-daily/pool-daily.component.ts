import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Pool } from 'src/app/shared/interfaces/pool';
import { PoolsService } from 'src/app/shared/services/pool/pools.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pool-daily',
  templateUrl: './pool-daily.component.html',
  styleUrls: ['./pool-daily.component.css']
})
export class PoolDailyComponent implements OnInit {
  public pool: Pool;
  public poolList: Array<any>;
  public pairList: Array<any>;
  public displayedColumns = ["Date", "TOTAL", "Increment", "RealIncrement", "Benefit", "NewCapital"];
  public displayedColumnsLong = ["Date", "Hide Pairs"];
  public displayedColumnsShort = ["Date", "Show Pairs", "TOTAL", "Increment", "RealIncrement", "Benefit", "NewCapital"];
  public dataSource: any;
  public columnsShown: boolean = false;
  public columnsBtn: string = "Show Pairs";
  public pagesize: any;
  public max: number;
  public dollarUS = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'});
  public message: string;
  public type: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private poolsService: PoolsService,
    private utils: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.poolList = [];
    this.pairList = [];
    this.activatedRoute.queryParams.subscribe(params => {
      this.message = params['message'];
      this.type = params['type'];
    });
   }

  async ngOnInit(): Promise<void>{
    // await to get the list for paginator and sorting
    this.poolList = await this.getPoolsByDay();
    if (this.poolList.length == 0){
      this.router.navigate([ '/home'], { queryParams: { isData: false } } );
    }
    // Get list of pairs on pools
    this.pairList = await this.getPoolsDistinct();
    for (let pa in this.pairList) {
      this.displayedColumnsLong.push(this.pairList[pa].exchange + ": " + this.pairList[pa].tickerA + " / " + this.pairList[pa].tickerB);
    }
    this.displayedColumnsLong.push("TOTAL", "Increment", "RealIncrement", "Benefit", "NewCapital");
    this.displayedColumns = this.displayedColumnsShort;
    this.max = this.poolList.length;
    if (this.max < 10) {this.paginator.pageSize = this.max;}
    else {this.paginator.pageSize = 10;}
    this.pagesize = this.utils.pageSize(this.max);
    this.dataSource = new MatTableDataSource(this.poolList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if(!window.location.href.includes('Home')) {
      this.utils.menuHover('menupool');
    }
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = this.paginator.pageSize;
    this.changeDetectorRef.detectChanges();
  }

  // get pools data
  private async getPoolsByDay(): Promise<any> {
    return new Promise(resolve => {
      let poolList: any[];
      this.poolsService.getPoolsByDay().subscribe(
        (data: any)    => { poolList = data.data; },
        (error: Error) => { console.log('Error: ', error); this.router.navigate([ '/serverError'], { queryParams: { page: window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length ) } } ); },
        ()             => { console.log('Petición realizada correctamente');
                            resolve(poolList);
        }
      )
    })
  }

  private async getPoolsDistinct(): Promise<any> {
    return new Promise(resolve => {
      let poolList: any[];
      this.poolsService.getPoolsDistinct().subscribe(
        (data: any)    => { poolList = data.data; },
        (error: Error) => { console.log('Error: ', error); this.router.navigate([ '/serverError'], { queryParams: { page: window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length ) } } ); },
        ()             => { console.log('Petición realizada correctamente');
                            resolve(poolList);
        }
      )
    })
  }

  // event and filter for the filtering
  target(event: KeyboardEvent): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("wrong target");
    }
    return event.target;
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Shows or hides columns on the table
  submit(){
    if (!this.columnsShown) {
      this.displayedColumns = this.displayedColumnsLong;
      this.columnsBtn = "Hide Pairs";
      this.columnsShown = true;
    } else {
      this.displayedColumns = this.displayedColumnsShort;
      this.columnsBtn = "Show Pairs";
      this.columnsShown = false;
    }
  }

}
