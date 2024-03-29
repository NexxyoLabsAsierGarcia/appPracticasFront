import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Pool } from 'src/app/shared/classes/pool/pool';
import { Progress } from 'src/app/shared/classes/progress/progress';
import { PoolsService } from 'src/app/shared/services/pool/pools.service';
import { ProgressService } from 'src/app/shared/services/progress/progress.service';
import { CapitalsService } from 'src/app/shared/services/capital/capitals.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';

@Component({
  selector: 'app-pool-update',
  templateUrl: './pool-update.component.html',
  styleUrls: ['./pool-update.component.css']
})
export class PoolUpdateComponent implements OnInit {
  public pool: Pool;
  public progress: Progress;
  public poolList: Array<any>;
  public poolStatus: Array<any>;
  public poolStat: string;
  public donePools: Array<number>;
  public displayedColumns: Array<string> = ["poolupdate_pair", "exchange", "tokenA", "tokenB", "Last pool", "add"];
  public dataSource: any;
  public poolToDo: boolean = true;
  public dollarUS = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'});

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private poolsService: PoolsService,
    private progressService: ProgressService,
    private capitalsService: CapitalsService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.pool = new Pool();
    this.progress = new Progress();
    this.poolList = [];
    this.poolStatus = [];
    this.poolStat = '';
    this.donePools = [];
  }

  async ngOnInit(): Promise<void>{
    // Check if previous day's pools are done
    await this.checkProgress();

    // await to get the list for paginator and sorting
    this.poolList = await this.getPoolsDistinct();
    if (this.poolList.length == 0){
      this.router.navigate([ '/home'], { queryParams: { isData: false } } );
    }
    // Gets poo status
    this.poolStatus = await this.getPoolStatus();
    if(this.poolStat == 'done') {
      this.poolToDo = false;
    }
    else if (this.poolStat == 'half') {
        for (let p in this.poolStatus) {
          this.donePools[this.poolStatus[p].pool_pair] = this.poolStatus[p].invested_quantity;
      }
    }
    this.dataSource = new MatTableDataSource(this.poolList);
    this.dataSource.sort = this.sort;
    this.utils.menuHover('menuupdate');
  }

  // get pairs data to show on form
  private async getPoolStatus(): Promise<any> {
    return new Promise(resolve => {
      let poolStatus: any[];
      this.poolsService.getPoolStatus().subscribe(
        (data: any)    => { poolStatus = data.data,
                            this.poolStat = data.status;
        },
        (error: Error) => { console.log('Error: ', error); this.router.navigate([ '/serverError'], { queryParams: { page: window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length ) } } ); },
        ()             => { console.log('Petición realizada correctamente');
                            resolve(poolStatus);
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

  // On form submit => check if pool exists => create pools on DB
  public async submit(value:Array<any>): Promise<void> {
    await this.createPools(value);
    this.progress = await this.addProgress();
    await this.addCapitals();
  }

  private async checkProgress(): Promise<any> {
    this.progressService.checkProgress().subscribe( () => { console.log("progresses checked"); } );
  }

  // Creates pool on database
  private async createPools(value: Array<any>):Promise<any> {
    return new Promise( resolve => {
      this.poolsService.addPools(value).subscribe(
        () => { console.log("pools added");
                resolve("pools added");
        },
      );
    });
  }

  private async addProgress(): Promise<any> {
    return new Promise(resolve => {
      let prog = new Progress();
      // Create progress of the pool
      this.progressService.addProgress().subscribe(
        (data: any)    => { prog = data.progress; },
        (error: Error) => { console.error("Error al realizar el acceso"); this.router.navigate([ '/serverError'], { queryParams: { page: window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length ) } } ); },
        ()             => { console.log('Petición realizada correctamente');
                            resolve(prog);
        }
      )
    });
  }

  private async addCapitals(): Promise<any> {
    // Create capitals with that progress
      this.capitalsService.addCapitals(this.progress).subscribe(
      (data: any)    => { this.router.navigate(['/poolsByDay'], { queryParams: { message: ": " + new Date(), type: "sub"} } ); },
      (error: Error) => { console.error("Error al realizar el acceso"); this.router.navigate([ '/serverError'], { queryParams: { page: window.location.href.substring(window.location.href.lastIndexOf('/'), window.location.href.length ) } } ); }
    )
  }

}
