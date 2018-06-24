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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ShipmentBatchService } from './ShipmentBatch.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-ShipmentBatch',
	templateUrl: './ShipmentBatch.component.html',
	styleUrls: ['./ShipmentBatch.component.css'],
  providers: [ShipmentBatchService]
})
export class ShipmentBatchComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          shipmentId = new FormControl("", Validators.required);
        
  
      
          trackingNumber = new FormControl("", Validators.required);
        
  
      
          message = new FormControl("", Validators.required);
        
  
      
          status = new FormControl("", Validators.required);
        
  
      
          location = new FormControl("", Validators.required);
        
  
      
          temperatureReadings = new FormControl("", Validators.required);
        
  
      
          owner = new FormControl("", Validators.required);
        
  
      
          holder = new FormControl("", Validators.required);
        
  
      
          contract = new FormControl("", Validators.required);
        
  
      
          assetExchanged = new FormControl("", Validators.required);
        
  


  constructor(private serviceShipmentBatch:ShipmentBatchService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          shipmentId:this.shipmentId,
        
    
        
          trackingNumber:this.trackingNumber,
        
    
        
          message:this.message,
        
    
        
          status:this.status,
        
    
        
          location:this.location,
        
    
        
          temperatureReadings:this.temperatureReadings,
        
    
        
          owner:this.owner,
        
    
        
          holder:this.holder,
        
    
        
          contract:this.contract,
        
    
        
          assetExchanged:this.assetExchanged
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceShipmentBatch.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.logistics.testnet.ShipmentBatch",
      
        
          "shipmentId":this.shipmentId.value,
        
      
        
          "trackingNumber":this.trackingNumber.value,
        
      
        
          "message":this.message.value,
        
      
        
          "status":this.status.value,
        
      
        
          "location":this.location.value,
        
      
        
          "temperatureReadings":this.temperatureReadings.value,
        
      
        
          "owner":this.owner.value,
        
      
        
          "holder":this.holder.value,
        
      
        
          "contract":this.contract.value,
        
      
        
          "assetExchanged":this.assetExchanged.value
        
      
    };

    this.myForm.setValue({
      
        
          "shipmentId":null,
        
      
        
          "trackingNumber":null,
        
      
        
          "message":null,
        
      
        
          "status":null,
        
      
        
          "location":null,
        
      
        
          "temperatureReadings":null,
        
      
        
          "owner":null,
        
      
        
          "holder":null,
        
      
        
          "contract":null,
        
      
        
          "assetExchanged":null
        
      
    });

    return this.serviceShipmentBatch.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "shipmentId":null,
        
      
        
          "trackingNumber":null,
        
      
        
          "message":null,
        
      
        
          "status":null,
        
      
        
          "location":null,
        
      
        
          "temperatureReadings":null,
        
      
        
          "owner":null,
        
      
        
          "holder":null,
        
      
        
          "contract":null,
        
      
        
          "assetExchanged":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.logistics.testnet.ShipmentBatch",
      
        
          
        
    
        
          
            "trackingNumber":this.trackingNumber.value,
          
        
    
        
          
            "message":this.message.value,
          
        
    
        
          
            "status":this.status.value,
          
        
    
        
          
            "location":this.location.value,
          
        
    
        
          
            "temperatureReadings":this.temperatureReadings.value,
          
        
    
        
          
            "owner":this.owner.value,
          
        
    
        
          
            "holder":this.holder.value,
          
        
    
        
          
            "contract":this.contract.value,
          
        
    
        
          
            "assetExchanged":this.assetExchanged.value
          
        
    
    };

    return this.serviceShipmentBatch.updateAsset(form.get("shipmentId").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceShipmentBatch.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceShipmentBatch.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "shipmentId":null,
          
        
          
            "trackingNumber":null,
          
        
          
            "message":null,
          
        
          
            "status":null,
          
        
          
            "location":null,
          
        
          
            "temperatureReadings":null,
          
        
          
            "owner":null,
          
        
          
            "holder":null,
          
        
          
            "contract":null,
          
        
          
            "assetExchanged":null 
          
        
      };



      
        if(result.shipmentId){
          
            formObject.shipmentId = result.shipmentId;
          
        }else{
          formObject.shipmentId = null;
        }
      
        if(result.trackingNumber){
          
            formObject.trackingNumber = result.trackingNumber;
          
        }else{
          formObject.trackingNumber = null;
        }
      
        if(result.message){
          
            formObject.message = result.message;
          
        }else{
          formObject.message = null;
        }
      
        if(result.status){
          
            formObject.status = result.status;
          
        }else{
          formObject.status = null;
        }
      
        if(result.location){
          
            formObject.location = result.location;
          
        }else{
          formObject.location = null;
        }
      
        if(result.temperatureReadings){
          
            formObject.temperatureReadings = result.temperatureReadings;
          
        }else{
          formObject.temperatureReadings = null;
        }
      
        if(result.owner){
          
            formObject.owner = result.owner;
          
        }else{
          formObject.owner = null;
        }
      
        if(result.holder){
          
            formObject.holder = result.holder;
          
        }else{
          formObject.holder = null;
        }
      
        if(result.contract){
          
            formObject.contract = result.contract;
          
        }else{
          formObject.contract = null;
        }
      
        if(result.assetExchanged){
          
            formObject.assetExchanged = result.assetExchanged;
          
        }else{
          formObject.assetExchanged = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "shipmentId":null,
        
      
        
          "trackingNumber":null,
        
      
        
          "message":null,
        
      
        
          "status":null,
        
      
        
          "location":null,
        
      
        
          "temperatureReadings":null,
        
      
        
          "owner":null,
        
      
        
          "holder":null,
        
      
        
          "contract":null,
        
      
        
          "assetExchanged":null 
        
      
      });
  }

}
