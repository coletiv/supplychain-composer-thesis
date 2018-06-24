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
import { OrderContractService } from './OrderContract.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-OrderContract',
	templateUrl: './OrderContract.component.html',
	styleUrls: ['./OrderContract.component.css'],
  providers: [OrderContractService]
})
export class OrderContractComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          orderId = new FormControl("", Validators.required);
        
  
      
          buyer = new FormControl("", Validators.required);
        
  
      
          seller = new FormControl("", Validators.required);
        
  
      
          expectedArrivalLocation = new FormControl("", Validators.required);
        
  
      
          payOnArrival = new FormControl("", Validators.required);
        
  
      
          arrivalDateTime = new FormControl("", Validators.required);
        
  
      
          paymentPrice = new FormControl("", Validators.required);
        
  


  constructor(private serviceOrderContract:OrderContractService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          orderId:this.orderId,
        
    
        
          buyer:this.buyer,
        
    
        
          seller:this.seller,
        
    
        
          expectedArrivalLocation:this.expectedArrivalLocation,
        
    
        
          payOnArrival:this.payOnArrival,
        
    
        
          arrivalDateTime:this.arrivalDateTime,
        
    
        
          paymentPrice:this.paymentPrice
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceOrderContract.getAll()
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
      $class: "org.logistics.testnet.OrderContract",
      
        
          "orderId":this.orderId.value,
        
      
        
          "buyer":this.buyer.value,
        
      
        
          "seller":this.seller.value,
        
      
        
          "expectedArrivalLocation":this.expectedArrivalLocation.value,
        
      
        
          "payOnArrival":this.payOnArrival.value,
        
      
        
          "arrivalDateTime":this.arrivalDateTime.value,
        
      
        
          "paymentPrice":this.paymentPrice.value
        
      
    };

    this.myForm.setValue({
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "seller":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null
        
      
    });

    return this.serviceOrderContract.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "seller":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null 
        
      
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
      $class: "org.logistics.testnet.OrderContract",
      
        
          
        
    
        
          
            "buyer":this.buyer.value,
          
        
    
        
          
            "seller":this.seller.value,
          
        
    
        
          
            "expectedArrivalLocation":this.expectedArrivalLocation.value,
          
        
    
        
          
            "payOnArrival":this.payOnArrival.value,
          
        
    
        
          
            "arrivalDateTime":this.arrivalDateTime.value,
          
        
    
        
          
            "paymentPrice":this.paymentPrice.value
          
        
    
    };

    return this.serviceOrderContract.updateAsset(form.get("orderId").value,this.asset)
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

    return this.serviceOrderContract.deleteAsset(this.currentId)
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

    return this.serviceOrderContract.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "orderId":null,
          
        
          
            "buyer":null,
          
        
          
            "seller":null,
          
        
          
            "expectedArrivalLocation":null,
          
        
          
            "payOnArrival":null,
          
        
          
            "arrivalDateTime":null,
          
        
          
            "paymentPrice":null 
          
        
      };



      
        if(result.orderId){
          
            formObject.orderId = result.orderId;
          
        }else{
          formObject.orderId = null;
        }
      
        if(result.buyer){
          
            formObject.buyer = result.buyer;
          
        }else{
          formObject.buyer = null;
        }
      
        if(result.seller){
          
            formObject.seller = result.seller;
          
        }else{
          formObject.seller = null;
        }
      
        if(result.expectedArrivalLocation){
          
            formObject.expectedArrivalLocation = result.expectedArrivalLocation;
          
        }else{
          formObject.expectedArrivalLocation = null;
        }
      
        if(result.payOnArrival){
          
            formObject.payOnArrival = result.payOnArrival;
          
        }else{
          formObject.payOnArrival = null;
        }
      
        if(result.arrivalDateTime){
          
            formObject.arrivalDateTime = result.arrivalDateTime;
          
        }else{
          formObject.arrivalDateTime = null;
        }
      
        if(result.paymentPrice){
          
            formObject.paymentPrice = result.paymentPrice;
          
        }else{
          formObject.paymentPrice = null;
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
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "seller":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null 
        
      
      });
  }

}
