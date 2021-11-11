import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Pair } from 'src/app/shared/classes/pair/pair';
import { PairsService } from 'src/app/shared/services/pair/pairs.service';
import { TokensService } from 'src/app/shared/services/token/tokens.service';
import { ExchangesService } from 'src/app/shared/services/exchange/exchanges.service';
import { UtilsService } from 'src/app/shared/services/utils/utils.service';
import { ValidatorService } from 'src/app/shared/services/validator/validator.service';

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
  public isOnDB: boolean = true;

  constructor(private pairsService: PairsService, private tokensService: TokensService, private exchangesService: ExchangesService, private utils: UtilsService, private validator: ValidatorService, private router: Router) {
    this.pair = new Pair();
    this.id = router.url.split('/').pop();
    this.pairInfo = [];
    this.pairList = [];
    this.tokenList = [];
    this.exchangeList = [];
   }

  ngOnInit(): void {
    this.exchangesService.getExchanges().subscribe(
      (data: any) => {
        this.exchangeList = data.data;
      }
    )
    this.tokensService.getTokens().subscribe(
      (data: any) => {
        this.tokenList = data.data;
      }
    )
   this.getPair();
   this.utils.menuHover('menupair');
  }

  // get pair data to show on form
  public getPair() {
    this.pairsService.getPair(this.id).subscribe(
      (data: any)    => { this.pairInfo = data.data[0];
                          this.pair.pair_id = this.pairInfo.pair_id;
                          this.pair.tokenA = this.pairInfo.tokenA;
                          if(this.pairInfo.tokenB == null){
                            this.pair.tokenB = -1;
                          } else {
                            this.pair.tokenB = this.pairInfo.tokenB;
                          }
                          this.pair.pair_exchange = this.pairInfo.pair_exchange;
      },
      (error: Error) => { console.log('Error: ', error); },
      () => { console.log('Petición realizada correctamente'); }
    )
  }

  // On form submit => modify pair on DB
  public submit(): void {
    if (this.pair.tokenB == -1) {
      this.pair.tokenB = null;
    }
    document.getElementById('pairexists')?.classList.add('displaynone');
    document.getElementById('pairformalert')?.classList.remove('formalert');

    this.validator.checkPair(this.pair).subscribe(
      (data: any)    => { if((!data.pair1 || data.pair1 == null) && (!data.pair2 || data.pair2 == null)) {
                            this.isOnDB = false;
                          } else {
                            this.isOnDB = true;
                          }
                        },
      (error: Error) => { console.error("Error al realizar el acceso"); },
      ()             => {
                          if(!this.isOnDB) {
                            this.pairsService.modPair(this.pairInfo.pair_id, this.pair).subscribe(
                              (data: any)    => { this.router.navigate(['/PairsList']); },
                              (error: Error) => { console.error("Error al realizar el acceso"); }
                            )
                          } else {
                            if (this.isOnDB){
                              document.getElementById('pairexists')?.classList.remove('displaynone');
                              document.getElementById('pairformalert')?.classList.add('formalert');
                            }
                          }
                        }
      )
  }


}
