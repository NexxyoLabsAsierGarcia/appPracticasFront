import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Pair } from 'src/app/shared/classes/pair/pair';
import { PairsService } from 'src/app/shared/services/pair/pairs.service';
import { TokensService } from 'src/app/shared/services/token/tokens.service';
import { ExchangesService } from 'src/app/shared/services/exchange/exchanges.service';

@Component({
  selector: 'app-pair-mod',
  templateUrl: './pair-mod.component.html',
  styleUrls: ['./pair-mod.component.css']
})
export class PairModComponent implements OnInit {
  public pair: Pair;
  public pairInfo: any;
  public id: any;
  public pairList: any;
  public tokenList: any;
  public exchangeList: any;

  constructor(private pairsService: PairsService, private router: Router, private tokensService: TokensService, private exchangesService: ExchangesService) {
    this.pair = new Pair();
    this.id = router.url.split('/').pop();
    this.pairInfo = [];
    this.pairList = [];
    this.tokenList = [];
    this.exchangeList = [];
   }

  ngOnInit(): void {
    this.exchangesService.getExchanges().subscribe(
      (data) => {
        this.exchangeList = data.data;
      }
    )
    this.tokensService.getTokens().subscribe(
      (data) => {
        this.tokenList = data.data;
      }
    )
   this.getPair();
  }

  // get pair data to show on form
  public getPair() {
    this.pairsService.getPair(this.id).subscribe(
      (data) => {
        this.pairInfo = data.data[0];
        this.pair.pair_id = this.pairInfo.pair_id;
        this.pair.tokenA = this.pairInfo.tokenA;
        console.log(this.pair.tokenB);
        if(this.pairInfo.tokenB == null){
          this.pair.tokenB = -1;
        } else {
          this.pair.tokenB = this.pairInfo.tokenB;
        }

        this.pair.pair_exchange = this.pairInfo.pair_exchange;
      },
      (error) => {
        console.log('Error: ', error);
      },
      () => {
        console.log('Petición realizada correctamente');
      }
    )
  }

  // On form submit => modify pair on DB
  public submit(): void {
    if (this.pair.tokenB == -1) {
      this.pair.tokenB = null;
    }
    this.pairsService.modPair(this.pairInfo.pair_id, this.pair).subscribe(
      (data: any) => {
        this.router.navigate(['/PairsList']);
      },
      (error: Error) => {
        console.error("Error al realizar el acceso");
      }
    )
  }
}
