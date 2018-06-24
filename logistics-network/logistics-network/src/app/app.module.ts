/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
// import { TransactionComponent } from './Transaction/Transaction.component'

import { CommodityComponent } from './Commodity/Commodity.component';
import { ShipmentBatchComponent } from './ShipmentBatch/ShipmentBatch.component';
import { OrderContractComponent } from './OrderContract/OrderContract.component';


  import { SupplierComponent } from './Supplier/Supplier.component';
  import { ManufacturerComponent } from './Manufacturer/Manufacturer.component';
  import { DistributorComponent } from './Distributor/Distributor.component';
  import { RetailerComponent } from './Retailer/Retailer.component';
  import { CustomerComponent } from './Customer/Customer.component';
  import { AuditorComponent } from './Auditor/Auditor.component';


  import { TemperatureReadingComponent } from './TemperatureReading/TemperatureReading.component';
  import { CreateShipmentAndContractComponent } from './CreateShipmentAndContract/CreateShipmentAndContract.component';
  import { UpdateShipmentComponent } from './UpdateShipment/UpdateShipment.component';
  import { TransferCommodityPossessionComponent } from './TransferCommodityPossession/TransferCommodityPossession.component';
  import { ReportDamagedGoodComponent } from './ReportDamagedGood/ReportDamagedGood.component';
  import { TransformCommoditiesComponent } from './TransformCommodities/TransformCommodities.component';
  import { SetupDemoComponent } from './SetupDemo/SetupDemo.component';
  import { TestTransactionComponent } from './TestTransaction/TestTransaction.component';
@NgModule({
  declarations: [
    AppComponent,
		HomeComponent,
    // TransactionComponent,
    CommodityComponent,
    ShipmentBatchComponent,
    
    OrderContractComponent
    ,

    SupplierComponent,
      ManufacturerComponent,
      DistributorComponent,
      RetailerComponent,
      CustomerComponent,
      
      AuditorComponent
      ,

    TemperatureReadingComponent,
        CreateShipmentAndContractComponent,
        UpdateShipmentComponent,
        TransferCommodityPossessionComponent,
        ReportDamagedGoodComponent,
        TransformCommoditiesComponent,
        SetupDemoComponent,
        
        TestTransactionComponent
        
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
