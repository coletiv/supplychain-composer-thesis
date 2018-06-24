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
import { CreateShipmentAndContractService } from './CreateShipmentAndContract.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-CreateShipmentAndContract',
	templateUrl: './CreateShipmentAndContract.component.html',
	styleUrls: ['./CreateShipmentAndContract.component.css'],
  providers: [CreateShipmentAndContractService]
})
export class CreateShipmentAndContractComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
	private errorMessage;

  
      
          shipmentId = new FormControl("", Validators.required);
        
  
      
          trackingNumber = new FormControl("", Validators.required);
        
  
      
          message = new FormControl("", Validators.required);
        
  
      
          status = new FormControl("", Validators.required);
        
  
      
          location = new FormControl("", Validators.required);
        
  
      
          owner = new FormControl("", Validators.required);
        
  
      
          assetExchanged = new FormControl("", Validators.required);
        
  
      
          orderId = new FormControl("", Validators.required);
        
  
      
          buyer = new FormControl("", Validators.required);
        
  
      
          expectedArrivalLocation = new FormControl("", Validators.required);
        
  
      
          payOnArrival = new FormControl("", Validators.required);
        
  
      
          arrivalDateTime = new FormControl("", Validators.required);
        
  
      
          paymentPrice = new FormControl("", Validators.required);
        
  
      
          transactionId = new FormControl("", Validators.required);
        
  
      
          timestamp = new FormControl("", Validators.required);
        
  


  constructor(private serviceCreateShipmentAndContract:CreateShipmentAndContractService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          shipmentId:this.shipmentId,
        
    
        
          trackingNumber:this.trackingNumber,
        
    
        
          message:this.message,
        
    
        
          status:this.status,
        
    
        
          location:this.location,
        
    
        
          owner:this.owner,
        
    
        
          assetExchanged:this.assetExchanged,
        
    
        
          orderId:this.orderId,
        
    
        
          buyer:this.buyer,
        
    
        
          expectedArrivalLocation:this.expectedArrivalLocation,
        
    
        
          payOnArrival:this.payOnArrival,
        
    
        
          arrivalDateTime:this.arrivalDateTime,
        
    
        
          paymentPrice:this.paymentPrice,
        
    
        
          transactionId:this.transactionId,
        
    
        
          timestamp:this.timestamp
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceCreateShipmentAndContract.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: "org.logistics.testnet.CreateShipmentAndContract",
      
        
          "shipmentId":this.shipmentId.value,
        
      
        
          "trackingNumber":this.trackingNumber.value,
        
      
        
          "message":this.message.value,
        
      
        
          "status":this.status.value,
        
      
        
          "location":this.location.value,
        
      
        
          "owner":this.owner.value,
        
      
        
          "assetExchanged":this.assetExchanged.value,
        
      
        
          "orderId":this.orderId.value,
        
      
        
          "buyer":this.buyer.value,
        
      
        
          "expectedArrivalLocation":this.expectedArrivalLocation.value,
        
      
        
          "payOnArrival":this.payOnArrival.value,
        
      
        
          "arrivalDateTime":this.arrivalDateTime.value,
        
      
        
          "paymentPrice":this.paymentPrice.value,
        
      
        
          "transactionId":this.transactionId.value,
        
      
        
          "timestamp":this.timestamp.value
        
      
    };

    this.myForm.setValue({
      
        
          "shipmentId":null,
        
      
        
          "trackingNumber":null,
        
      
        
          "message":null,
        
      
        
          "status":null,
        
      
        
          "location":null,
        
      
        
          "owner":null,
        
      
        
          "assetExchanged":null,
        
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null,
        
      
        
          "transactionId":null,
        
      
        
          "timestamp":null
        
      
    });

    return this.serviceCreateShipmentAndContract.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "shipmentId":null,
        
      
        
          "trackingNumber":null,
        
      
        
          "message":null,
        
      
        
          "status":null,
        
      
        
          "location":null,
        
      
        
          "owner":null,
        
      
        
          "assetExchanged":null,
        
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null,
        
      
        
          "transactionId":null,
        
      
        
          "timestamp":null 
        
      
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


   updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: "org.logistics.testnet.CreateShipmentAndContract",
      
        
          
            "shipmentId":this.shipmentId.value,
          
        
    
        
          
            "trackingNumber":this.trackingNumber.value,
          
        
    
        
          
            "message":this.message.value,
          
        
    
        
          
            "status":this.status.value,
          
        
    
        
          
            "location":this.location.value,
          
        
    
        
          
            "owner":this.owner.value,
          
        
    
        
          
            "assetExchanged":this.assetExchanged.value,
          
        
    
        
          
            "orderId":this.orderId.value,
          
        
    
        
          
            "buyer":this.buyer.value,
          
        
    
        
          
            "expectedArrivalLocation":this.expectedArrivalLocation.value,
          
        
    
        
          
            "payOnArrival":this.payOnArrival.value,
          
        
    
        
          
            "arrivalDateTime":this.arrivalDateTime.value,
          
        
    
        
          
            "paymentPrice":this.paymentPrice.value,
          
        
    
        
          
        
    
        
          
            "timestamp":this.timestamp.value
          
        
    
    };

    return this.serviceCreateShipmentAndContract.updateTransaction(form.get("transactionId").value,this.Transaction)
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


  deleteTransaction(): Promise<any> {

    return this.serviceCreateShipmentAndContract.deleteTransaction(this.currentId)
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

    return this.serviceCreateShipmentAndContract.getTransaction(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "shipmentId":null,
          
        
          
            "trackingNumber":null,
          
        
          
            "message":null,
          
        
          
            "status":null,
          
        
          
            "location":null,
          
        
          
            "owner":null,
          
        
          
            "assetExchanged":null,
          
        
          
            "orderId":null,
          
        
          
            "buyer":null,
          
        
          
            "expectedArrivalLocation":null,
          
        
          
            "payOnArrival":null,
          
        
          
            "arrivalDateTime":null,
          
        
          
            "paymentPrice":null,
          
        
          
            "transactionId":null,
          
        
          
            "timestamp":null 
          
        
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
      
        if(result.owner){
          
            formObject.owner = result.owner;
          
        }else{
          formObject.owner = null;
        }
      
        if(result.assetExchanged){
          
            formObject.assetExchanged = result.assetExchanged;
          
        }else{
          formObject.assetExchanged = null;
        }
      
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
      
        if(result.transactionId){
          
            formObject.transactionId = result.transactionId;
          
        }else{
          formObject.transactionId = null;
        }
      
        if(result.timestamp){
          
            formObject.timestamp = result.timestamp;
          
        }else{
          formObject.timestamp = null;
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
        
      
        
          "owner":null,
        
      
        
          "assetExchanged":null,
        
      
        
          "orderId":null,
        
      
        
          "buyer":null,
        
      
        
          "expectedArrivalLocation":null,
        
      
        
          "payOnArrival":null,
        
      
        
          "arrivalDateTime":null,
        
      
        
          "paymentPrice":null,
        
      
        
          "transactionId":null,
        
      
        
          "timestamp":null 
        
      
      });
  }

}

