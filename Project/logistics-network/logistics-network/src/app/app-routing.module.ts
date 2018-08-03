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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

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
const routes: Routes = [
     //{ path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		
		{ path: 'Commodity', component: CommodityComponent},
    
		{ path: 'ShipmentBatch', component: ShipmentBatchComponent},
    
		{ path: 'OrderContract', component: OrderContractComponent},
    
    
      { path: 'Supplier', component: SupplierComponent},
      
      { path: 'Manufacturer', component: ManufacturerComponent},
      
      { path: 'Distributor', component: DistributorComponent},
      
      { path: 'Retailer', component: RetailerComponent},
      
      { path: 'Customer', component: CustomerComponent},
      
      { path: 'Auditor', component: AuditorComponent},
      
      
        { path: 'TemperatureReading', component: TemperatureReadingComponent},
        
        { path: 'CreateShipmentAndContract', component: CreateShipmentAndContractComponent},
        
        { path: 'UpdateShipment', component: UpdateShipmentComponent},
        
        { path: 'TransferCommodityPossession', component: TransferCommodityPossessionComponent},
        
        { path: 'ReportDamagedGood', component: ReportDamagedGoodComponent},
        
        { path: 'TransformCommodities', component: TransformCommoditiesComponent},
        
        { path: 'SetupDemo', component: SetupDemoComponent},
        
        { path: 'TestTransaction', component: TestTransactionComponent},
        
		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
