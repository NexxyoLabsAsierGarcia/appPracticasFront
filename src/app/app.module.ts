import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule  } from "@angular/material/paginator";
import { MatProgressSpinnerModule  } from "@angular/material/progress-spinner";
import { MatSortModule  } from "@angular/material/sort";

import { MenuComponent } from './menu/menu.component';
import { PantallaComponent } from './views/pantalla/pantalla.component';
import { BloqueComponent } from './views/pantalla/bloque/bloque.component';
import { PaginaNoEncontradaComponent } from './views/pagina-no-encontrada/pagina-no-encontrada.component';
import { ClientsListComponent } from './views/client/clients-list/clients-list.component';
import { TokensListComponent } from './views/token/tokens-list/tokens-list.component';
import { ExchangesListComponent } from './views/exchange/exchanges-list/exchanges-list.component';
import { ClientAddComponent } from './views/client/client-add/client-add.component';
import { TokenAddComponent } from './views/token/token-add/token-add.component';
import { ExchangeAddComponent } from './views/exchange/exchange-add/exchange-add.component';
import { ExchangeModComponent } from './views/exchange/exchange-mod/exchange-mod.component';
import { TokenModComponent } from './views/token/token-mod/token-mod.component';
import { ClientModComponent } from './views/client/client-mod/client-mod.component';
import { PairsListComponent } from './views/pair/pairs-list/pairs-list.component';
import { PairAddComponent } from './views/pair/pair-add/pair-add.component';
import { PairModComponent } from './views/pair/pair-mod/pair-mod.component';
import { HomeComponent } from './views/home/home.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PantallaComponent,
    BloqueComponent,
    PaginaNoEncontradaComponent,
    ClientsListComponent,
    TokensListComponent,
    ExchangesListComponent,
    ClientAddComponent,
    TokenAddComponent,
    ExchangeAddComponent,
    ExchangeModComponent,
    TokenModComponent,
    ClientModComponent,
    PairsListComponent,
    PairAddComponent,
    PairModComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }
