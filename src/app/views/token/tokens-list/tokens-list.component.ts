import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { TokensService } from 'src/app/shared/services/token/tokens.service';

@Component({
  selector: 'app-tokens-list',
  templateUrl: './tokens-list.component.html',
  styleUrls: ['./tokens-list.component.css']
})
export class TokensListComponent implements OnInit {
  public tituloPagina: string = "Listado de Tokens";
  public tokenList: any;
  public displayedColumns= ["token_id", "token_name", "ticker", "edit"];
  public dataSource: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tokensService: TokensService) {
    this.tokenList = [];
   }

   async ngOnInit(): Promise<void>{
    // await to get the list for paginator and sorting
    this.tokenList = await this.getTokens();
    this.dataSource = new MatTableDataSource(this.tokenList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // get tokens data to show on form
  private getTokens(): Promise<any> {
    return new Promise(resolve => {
      let tokenList: any[];
      this.tokensService.getTokens().subscribe(
        (data) => {
          tokenList = data.data;
        },
        (error) => {
          console.log('Error: ', error);
        },
        () => {
          console.log('Petición realizada correctamente');
          resolve(tokenList);
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

}
