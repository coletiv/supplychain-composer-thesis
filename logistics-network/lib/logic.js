/* global getParticipantRegistry getAssetRegistry getFactory */

/* PROGRAMMATIC ACCESS CONTROL RULE EXAMPLES

// CHECK PARTICIPANT TYPE
 async function onPrivilegedTransaction(privilegedTransaction) {
       let currentParticipant = getCurrentParticipant();
       if (currentParticipant.getFullyQualifiedType() !== 'net.biz.digitalPropertyNetwork.PrivilegedPerson') {
           throw new Error('Transaction can only be submitted by a privileged person');
       }
       // Current participant must be a privileged person to get here.
   }

// CHECK PARTICIPANT ID
   async function onPrivilegedTransaction(privilegedTransaction) {
       let currentParticipant = getCurrentParticipant();
       if (currentParticipant.getFullyQualifiedIdentifier() !== 'net.biz.digitalPropertyNetwork.Person#PERSON_1') {
           throw new Error('Transaction can only be submitted by person 1');
       }
       // Current participant must be person 1 to get here.
   }

// CHECK OWNERSHIP OF ASSET
   async function onPrivilegedTransaction(privilegedTransaction) {
       // Get the owner of the asset in the transaction.
       let assetOwner = privilegedTransaction.asset.owner;
       let currentParticipant = getCurrentParticipant();
       if (currentParticipant.getFullyQualifiedIdentifier() !== asset.owner.getFullyQualifiedIdentifier()) {
           throw new Error('Transaction can only be submitted by the owner of the asset');
       }
       // Current participant must be the owner of the asset to get here.
   }

// CHECK PARTICIPANT CERTIFICATE
   async function onPrivilegedTransaction(privilegedTransaction) {
       let currentIdentity = getCurrentIdentity();
       // Get the PEM encoded certificate from the current identity.
       let certificate = currentIdentity.certificate;
       // Perform testing on the PEM encoded certificate.
       if (!certificate.match(/^----BEGIN CERTIFICATE----/)) {
            throw new Error('Transaction can only be submitted by a person with a valid certificate');
       }
       // Current identity must have a valid certificate to get here.
   }


*/

async function CreateShipmentAndContractAuxiliar(shipmentAndContract) {
    var factory = getFactory();
    var shipment = factory.newResource('org.logistics.testnet', 'ShipmentBatch', shipmentAndContract.shipmentId);
    var contract = factory.newResource('org.logistics.testnet', 'OrderContract', shipmentAndContract.orderId);
    
    
    //MANDATORY SHIPMENT PARAMETERS
    shipment.shipmentId = shipmentAndContract.shipmentId;
    shipment.trackingNumber = shipmentAndContract.trackingNumber;
    shipment.location = shipmentAndContract.location;
    shipment.owner = shipmentAndContract.owner;
    shipment.holder = shipmentAndContract.owner;
    shipment.assetExchanged = shipmentAndContract.assetExchanged;
    //OPTIONAL SHIPMENT PARAMETERS
    if (shipmentAndContract.status != '' && shipmentAndContract.status != null) {
        shipment.status = shipmentAndContract.status;
    }
    else {
        shipmentAndContract.status = 'WAITING';
    }

    if (shipmentAndContract.message == '' || shipmentAndContract.message == null) {
        shipmentAndContract.message = '';
    }else{
        shipment.message = shipmentAndContract.message;
    }
    shipment.temperatureReadings = [];
    //MANDATORY CONTRACT PARAMETERS
    console.log("hi");
    console.log("Contract: " + contract);
    contract.orderId = shipmentAndContract.orderId;
    contract.buyer = shipmentAndContract.buyer;
    contract.seller = shipmentAndContract.owner;
    contract.arrivalDateTime = shipmentAndContract.arrivalDateTime;
    contract.expectedArrivalLocation = shipmentAndContract.expectedArrivalLocation;
    contract.payOnArrival = shipmentAndContract.payOnArrival;
    contract.paymentPrice = shipmentAndContract.paymentPrice;
   
    shipment.contract = contract;

    return getAssetRegistry('org.logistics.testnet.ShipmentBatch')
    .then(function (shipmentAssetRegistry) {
        
        console.log("Shipment registry: " + shipmentAssetRegistry);
        console.log("Shipment to add: " + shipment);
        shipmentAssetRegistry.add(shipment);
        return getAssetRegistry('org.logistics.testnet.OrderContract');
    
    }).then(function(contractAssetRegistry){
        console.log("Contract registry: " + contractAssetRegistry);
        contractAssetRegistry.add(contract);
    });
   
}

function validPayment(shipment, transactionItems){
    const contract = shipment.contract;
    let payOut = contract.paymentPrice;

    console.log('Received at: ' + transactionItems.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // if the shipment did not arrive on time the payout is zero
    if (shipment.timestamp > contract.arrivalDateTime) {
        console.log('Late shipment');
    }

    if(contract.paymentPrice > contract.buyer.accountBalance)
        return false;
    else
        return true;
}

function payOut(sender, receiver, shipment){
    var ammount = shipment.contract.paymentPrice;
    //verify again, just cuz... hyperledger consensus algorithm makes sure this will not have concurrency issues, as each transaction runs in a specified order
    if(sender.accountBalance >= ammount){
        //transfer money
        sender.accountBalance -= ammount;
        receiver.accountBalance += ammount;
        //transfer ownership and holdership
        shipment.owner = sender;
        shipment.holder = sender;
    }
}

function checkLocationFraud(newLocation, expectedArrivalLocation, shipment){
    
    if(newLocation != expectedArrivalLocation){
        let event = getFactory().newEvent('org.logistics.testnet', 'detectLocationFraud');
        event.newLocation = newLocation;
        event.expectedArrivalLocation = expectedArrivalLocation;
        event.shipment = shipment;
        emit(event);
    }
}

async function isAnyAssetBeingShipped(assets){
    try{
        for(var i = 0; i< assets.length; i++){
            console.log("Asset... " + assets[i].owner);
        }
    }catch(e){
        throw 'Asset with ID ' + assets[i].getIdentifier() + ' does not exist';
    }
    for(var i = 0; i < assets.length;i++){
        var assetIdentifier = 'resource:org.logistics.testnet.Commodity#' +  assets[i].GTIN;
        console.log(assetIdentifier);
        const shipment = await query('getShipmentWhereCommodityExists', {commodities:assetIdentifier});
        console.log("Asset: " + assetIdentifier);
        console.log(shipment);
        console.log("Shipment size: " + shipment.length);
        // No shipments found means the assets dont belong to any shipment
        if (shipment.length == 0){
            return false;
        }else{
            return true;
        }
    }
}

async function supplyMemberExists(supplyChainMember){
  

    if(supplyChainMember === undefined){
        return false;
    }
    
    var memberID = supplyChainMember.getIdentifier();
    var memberType = supplyChainMember.getType();

    if(memberID === undefined || memberID == '' || memberID === null ){
        return false;
    }else{
        return getParticipantRegistry('org.logistics.testnet.' + memberType)
        .then(function (participantRegistry) {
        // Determine if the specific driver exists in the driver participant registry.
        return participantRegistry.exists(memberID);
        })
        .then(function (exists) {
        // Process the the boolean result.
        return exists;
        })
        .catch(function (error) {
        // Add optional error handling here.
        });
       
    }
}
 

/**
 * 
 * @param {org.logistics.testnet.CreateShipmentAndContract} shipmentAndContract - the CreateShipmentAndContract transaction
 * @transaction
 */
async function CreateShipmentAndContract(shipmentAndContract){
    //TODO: CHECK PERMISSIONS

    return supplyMemberExists(shipmentAndContract.owner).then(function(exists){
        console.log("Exists? " + exists);
        if (!exists)
            throw 'Shipment owner does not exist.'
        else   
            return supplyMemberExists(shipmentAndContract.buyer);
    }).then(function(exists){
        console.log("Exists? " + exists);
        if (!exists)
            throw 'Shipment buyer does not exist.' 
    }).then(function(exists){
        // Check if shipment owner is also the owner of all the assets
        var assetExchanged = shipmentAndContract.assetExchanged;
        for (var i = 0; i < assetExchanged.length; i++) {
            if (assetExchanged[i].owner.gs1CompanyPrefix != shipmentAndContract.owner.gs1CompanyPrefix) {
                throw 'The shipment owner is not the owner of all the commodities in the shipment (check if all the commodities exist).';
            }
        }

         //Checking that the actual arrival date is AFTER the current date
        var now = new Date();
        if (shipmentAndContract.arrivalDateTime <= now) {
            throw 'Arrival Date is set to before the current date.';
        }
        console.log("before creating");
        // after all the checks
        CreateShipmentAndContractAuxiliar(shipmentAndContract);

        return getAssetRegistry('org.logistics.testnet.ShipmentBatch')
    
    }).then(function(shipmentAssetRegistry){
        //console.log("Finally... " + shipmentAssetRegistry);
        return getAssetRegistry('org.logistics.testnet.OrderContract');
    });
    
}


/**
 * 
 * @param {org.logistics.testnet.UpdateShipment} updatedItems - the UpdateShipment transaction
 * @transaction
 */
async function UpdateShipment(transactionItems) {

    //TODO: CHECK PERMISSIONS
    //console.log(newHolder.accountBalance);

    var newHolder;
    var newStatus = transactionItems.status;
    var newLocation = transactionItems.newLocation;
    var shipment = transactionItems.shipment;
    var oldLocation = shipment.location;

    // If the optional field "newHolder" is filled out
    if(transactionItems.newHolder != '' && transactionItems.newHolder != null)
         newHolder = transactionItems.newHolder;
    else 
        newHolder = shipment.holder;

    const holderExists = await supplyMemberExists(newHolder);
    if(!holderExists)
        throw 'The specified holder does not exist.'
    console.log("Holder exists: " + holderExists);

    if(newStatus == 'DELIVERED'){
        //CHECK IF NEW HOLDER EXISTS

        if(newHolder.id == shipment.contract.buyer.id){
            if(shipment.contract.payOnArrival){
            //PAYMENT ON ARRIVAL

                //Verify balance
                if(validPayment(shipment, transactionItems)){

                    payOut(shipment.contract.buyer, shipment.contract.seller, shipment);
                    
                    shipment.status = newStatus;
                    shipment.location = newLocation;

                }else{
                    throw 'Not enough money to make the payment transaction on delivery';
                }
            }else{
            //NO PAYMENT ON ARRIVAL
            }

                shipment.status = newStatus;
                shipment.location = newLocation;
                shipment.owner = newHolder;
                shipment.holder = newHolder;

                //change owner of all assets individually
                for(var i=0; i<shipment.assetExchanged.length; i++){
                    shipment.assetExchanged[i].owner = newHolder;
                }           
        
        }else{
            throw 'Not delivering to the contract buyer!';
        }
    }else{
        shipment.status = newStatus;
        shipment.location = newLocation;
        shipment.holder = newHolder;
    }
    

    //checkLocationFraud(newLocation, shipment.contract.expectedArrivalLocation, shipment);
    
    //UPDATE ASSETS
    const commodityAssetRegistry=await getAssetRegistry('org.logistics.testnet.Commodity');
    await commodityAssetRegistry.updateAll(shipment.assetExchanged);
    
    //UPDATE SHIPMENT
    const shipmentAssetRegistry = await getAssetRegistry('org.logistics.testnet.ShipmentBatch');
    await shipmentAssetRegistry.update(shipment);
}

/**
 * 
 * @param {org.logistics.testnet.UpdateCommodity} update - the UpdateCommodity transaction
 * @transaction
 */
async function UpdateCommodity(update) {

    commodity = update.commodityToUpdate;

    commodity.type = update.type;
    commodity.name = update.name;
    commodity.description = update.description;
    commodity.itemCondition = update.itemCondition;

    //UPDATE ASSET
    const commodityAssetRegistry=await getAssetRegistry('org.logistics.testnet.Commodity');
    await commodityAssetRegistry.update(commodity);
}

/**
 * 
 * @param {org.logistics.testnet.DeleteCommodity} data - the DeleteCommodity transaction
 * @transaction
 */
async function DeleteCommodity(data) {

    commodity = data.commodityToDelete;

    //CHECK OWNER PERMISSION

    //check if it isnt in ANY shipment;
    const beingShipped = await isAnyAssetBeingShipped([commodity]);

    if (beingShipped)
        throw 'Can not transform products: 1 or more products are currently part of a shipment batch.';

    //UPDATE ASSET
    const commodityAssetRegistry=await getAssetRegistry('org.logistics.testnet.Commodity');
    await commodityAssetRegistry.remove(commodity);
}

/**
 * 
 * @param {org.logistics.testnet.ReportDamagedGood} damageReport - the ReportDamagedGood transaction
 * @transaction
 */
async function ReportDamagedGood(damageReport) {

    //TODO: CHECK PERMISSIONS: holder must be the same person reporting damage?

    var damagedGood = damageReport.damagedGood;

    //var arrayLength = damagedGoods.length;
    //for (var i = 0; i < arrayLength; i++) {
        damagedGood.itemCondition.status=damageReport.itemStatus;
        damagedGood.itemCondition.conditionDescription=damageReport.itemConditionDescription;
    //}

    const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
    await commodityAssetRegistry.update(damagedGood);
}

/**
 * 
 * @param {org.logistics.testnet.TransformCommodities} transformation - the TransformCommodity transaction
 * @transaction
 */
async function TransformCommodities(transformation) {
    console.log()

    //TODO: CHECK PERMISSIONS
    // ALL INPUT PRODUCTS MUST HAVE SAME OWNER - person calling this
    var inputProducts = transformation.commoditiesToBeConsumed;
    var outputProducts = transformation.commoditiesToBeCreated;
    var createdCommodities = [];

    const beingShipped = await isAnyAssetBeingShipped(inputProducts);

    console.log("Being shipped: " + beingShipped);
    if (beingShipped)
        throw 'Can not transform products: 1 or more products are currently part of a shipment batch.';
  
    for(var i = 0; i<outputProducts.length; i++){
     
        const ownerExists = await supplyMemberExists(outputProducts[i].owner);
       
        if(!ownerExists)
            throw 'Can not transform products. Unexistant owner of the output Commodity ' + outputProducts[i].getIdentifier();
    }

    //TODO: CHECK IF IT IS THE OWNER OF THE INPUT PRODUCTS DOING THE TRANSACTION
    //TODO: OWNER OF CREATED PRODUCTS = OWNER OF INPUT PRODUCTS

    if (inputProducts.length <= 0 || outputProducts.length <= 0){
        throw 'The number of commodities consumed or created can not be 0. To create or delete commodities, use the corresponding Add or Delete transactions.'
    }

    const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
    var factory = getFactory();

    for (var i = 0; i < outputProducts.length; i++){
      createdCommodities[i] = factory.newResource('org.logistics.testnet', 'Commodity', outputProducts[i].GTIN);
     
      createdCommodities[i].owner = outputProducts[i].owner;
      createdCommodities[i].type = outputProducts[i].type;
      createdCommodities[i].GTIN = outputProducts[i].GTIN;
      createdCommodities[i].name = outputProducts[i].name;
      createdCommodities[i].description = outputProducts[i].description;
      createdCommodities[i].itemCondition = outputProducts[i].itemCondition;
        
    }

    // Add the vehicles to the vehicle asset registry.
    //commodityAssetRegistry.addAll(createdCommodities);
    //commodityAssetRegistry.removeAll(inputProducts);

    let event = getFactory().newEvent('org.logistics.testnet', 'CommodityTransformation');
        event.oldCommodities = inputProducts;
        event.newCommodities = createdCommodities;
        emit(event);
}

/**
 * 
 * @param {org.logistics.testnet.RevertTransformation} transformation - the RevertTransformation transaction
 * @transaction
 *
async function RevertTransformation(transformation) {
    var inputProducts = transformation.input;
    var outputProducts = transformation.output;

    const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
    var factory = getFactory();

    // Apparently, there is no method to get the list of transactions in runtime; therefore, it is impossible to revert a transaction by just having its ID in runtime
    // Maybe if the client app reads the transaction and sends back the items to revert;

    //UNFINISHED
    // -> UNDOABLE

}
*/

/**
 * 
 * @param {org.logistics.testnet.TransferCommodityPossession} transfer - the TransferCommodityPossession transaction
 * @transaction
 */
async function TransferCommodityPossession(transfer) {

    //TODO: CHECK PERMISSIONS

    //verify if newholder exists
    try {
        var newOwner = transfer.newOwner;
        var oldOwner = transfer.commodity.owner;
        var commodity = transfer.commodity;

        const isBeingShipped = await isAnyAssetBeingShipped([commodity]);

        if (isBeingShipped)
            throw 'Can not transfer possession: the product is currently part of a shipment batch.';

        var currentShipments = await getAssetRegistry('org.logistics.testnet.ShipmentBatch');
        
        // INTEGRITY CHECKS -> Refactor into a function
        const ownerExists = await supplyMemberExists(newOwner);
        if (!ownerExists)
            throw 'The specified participant does not exist!';

        transfer.commodity.owner = transfer.newOwner;
        const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
        await commodityAssetRegistry.update(commodity);

        // Emit an event for the change of ownership
        let event = getFactory().newEvent('org.logistics.testnet', 'changeOwnershipEvent');
        event.commodity = commodity;
        event.oldOwner = oldOwner;
        event.newOwner = newOwner;
        emit(event);

    } catch (error) {
        console.log(error);
        // Add optional error handling here.
        throw error;
    }
}

/**
 * A temperature reading has been received for a shipment
 * @param {org.logistics.testnet.TemperatureReading} temperatureReading - the TemperatureReading transaction
 * @transaction
 */
async function temperatureReading(temperatureReading) { // eslint-disable-line no-unused-vars

    const shipment = temperatureReading.shipment;

    console.log('Adding temperature ' + temperatureReading.centigrade + ' to shipment ' + shipment.$identifier);

    if (shipment.temperatureReadings) {
        shipment.temperatureReadings.push(temperatureReading);
    } else {
        shipment.temperatureReadings = [temperatureReading];
    }

    // add the temp reading to the shipment
    const shipmentRegistry = await getAssetRegistry('org.logistics.testnet.ShipmentBatch');
    await shipmentRegistry.update(shipment);
}


/**
 * Test Transaction
 * @param {org.logistics.testnet.TestTransaction} testParameters - the TestTransaction transaction
 * @transaction
 */
async function TestTransaction(testParameters){

    var shipment = testParameters.shipment;
    shipment.status = 'PACKING';
    var commodity = testParameters.commodity;
   commodity.itemCondition.status = 'CRITICAL';

    //UPDATE SHIPMENT
    const shipmentAssetRegistry = await getAssetRegistry('org.logistics.testnet.ShipmentBatch');
    console.log("Shipment registry: " + shipmentAssetRegistry);
    await shipmentAssetRegistry.update(shipment);
    
    //UPDATE COMMODITY
    const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
    console.log("Commodity registry: " + commodityAssetRegistry);
    await commodityAssetRegistry.update(commodity);
    

    /*
    let event = getFactory().newEvent('org.logistics.testnet', 'TestEvent');
        event.eventString = 'Testing Notifications.'
        emit(event);
    */
}


/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.logistics.testnet.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) { // eslint-disable-line no-unused-vars

    /*
    const factory = getFactory();
    const NS = 'org.logistics.testnet';

    // 560 is Portugal's GS1 prefix for the companies based there

    // create the supplier
    const supplier = factory.newResource(NS, 'Supplier', 'supplier@email.com');
    const supplierAddress = factory.newConcept(NS, 'Address');
    supplierAddress.country = 'USA';
    supplier.address = supplierAddress;
    supplier.accountBalance = 0;

    // create the manufacturer
    const manufacturer = factory.newResource(NS, 'Importer', 'manufacturer@email.com');
    const manufacturerAddress = factory.newConcept(NS, 'Address');
    manufacturerAddress.country = 'UK';
    manufacturer.address = manufacturerAddress;
    manufacturer.accountBalance = 0;

    // create the distributor
    const retailer = factory.newResource(NS, 'Retailer', 'retailer@email.com');
    const retailerAddress = factory.newConcept(NS, 'Address');
    retailerAddress.country = 'Panama';
    retailer.address = retailerAddress;
    retailer.accountBalance = 0;

    // create the retailer
    const distributor = factory.newResource(NS, 'Distributor', 'shipper@email.com');
    const distributorAddress = factory.newConcept(NS, 'Address');
    distributorAddress.country = 'Panama';
    distributor.address = distributorAddress;
    distributor.accountBalance = 0;

    // create the contract
    const contract = factory.newResource(NS, 'OrderContract', 'CON_001');
    contract.buyer = factory.newRelationship(NS, 'SupplyChainMember ', 'buyer@email.com');
    contract.seller = factory.newRelationship(NS, 'SupplyChainMember', 'seller@email.com');
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
    contract.unitPrice = 0.5; // pay 50 cents per unit
    contract.minTemperature = 2; // min temperature for the cargo
    contract.maxTemperature = 10; // max temperature for the cargo
    contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
    contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp

    // create the shipment
    const shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
    shipment.type = 'BANANAS';
    shipment.status = 'IN_TRANSIT';
    shipment.unitCount = 5000;
    shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');

    // add the growers
    const supplierRegistry = await getParticipantRegistry(NS + '.Supplier');
    await supplierRegistry.addAll([supplier]);

    // add the importers
    const manufacturerRegistry = await getParticipantRegistry(NS + '.Manufacturer');
    await manufacturerRegistry.addAll([manufacturer]);

    // add the shippers
    const distributorRegistry = await getParticipantRegistry(NS + '.Distributor');
    await distributorRegistry.addAll([distributor]);

    // add the contracts
    const contractRegistry = await getAssetRegistry(NS + '.Contract');
    await contractRegistry.addAll([contract]);

    // add the shipments
    const shipmentRegistry = await getAssetRegistry(NS + '.Shipment');
    await shipmentRegistry.addAll([shipment]);
    */
}
