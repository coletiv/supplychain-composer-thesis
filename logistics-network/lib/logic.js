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
 /* global getParticipantRegistry getAssetRegistry getFactory */
/**
 * A shipment has been received by an importer
 * @param {org.logistics.testnet.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
/*
async function payOut(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;
    let payOut = contract.unitPrice * shipment.unitCount;

    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED';

    // if the shipment did not arrive on time the payout is zero
    if (shipmentReceived.timestamp > contract.arrivalDateTime) {
        payOut = 0;
        console.log('Late shipment');
    } else {
        // find the lowest temperature reading
        if (shipment.temperatureReadings) {
            // sort the temperatureReadings by centigrade
            shipment.temperatureReadings.sort(function (a, b) {
                return (a.centigrade - b.centigrade);
            });
            const lowestReading = shipment.temperatureReadings[0];
            const highestReading = shipment.temperatureReadings[shipment.temperatureReadings.length - 1];
            let penalty = 0;
            console.log('Lowest temp reading: ' + lowestReading.centigrade);
            console.log('Highest temp reading: ' + highestReading.centigrade);

            // does the lowest temperature violate the contract?
            if (lowestReading.centigrade < contract.minTemperature) {
                penalty += (contract.minTemperature - lowestReading.centigrade) * contract.minPenaltyFactor;
                console.log('Min temp penalty: ' + penalty);
            }

            // does the highest temperature violate the contract?
            if (highestReading.centigrade > contract.maxTemperature) {
                penalty += (highestReading.centigrade - contract.maxTemperature) * contract.maxPenaltyFactor;
                console.log('Max temp penalty: ' + penalty);
            }

            // apply any penalities
            payOut -= (penalty * shipment.unitCount);

            if (payOut < 0) {
                payOut = 0;
            }
        }
    }

    console.log('Payout: ' + payOut);
    contract.grower.accountBalance += payOut;
    contract.importer.accountBalance -= payOut;

    console.log('Grower: ' + contract.grower.$identifier + ' new balance: ' + contract.grower.accountBalance);
    console.log('Importer: ' + contract.importer.$identifier + ' new balance: ' + contract.importer.accountBalance);

    // update the grower's balance
    const growerRegistry = await getParticipantRegistry('org.logistics.testnet.Grower');
    await growerRegistry.update(contract.grower);

    // update the importer's balance
    const importerRegistry = await getParticipantRegistry('org.logistics.testnet.Importer');
    await importerRegistry.update(contract.importer);

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.logistics.testnet.Shipment');
    await shipmentRegistry.update(shipment);
}
*/
/**
 * 
 * @param {org.logistics.testnet.TransferCommodity} transfer - the TransferCommodity transaction
 * @transaction
 */
 async function TransferCommodity(transfer) {
    try {
        var newOwner = transfer.newOwner;
        var commodity = transfer.commodity;
        var oldOwner = transfer.commodity.owner;

        // INTEGRITY CHECKS -> Refactor into a function
        if (newOwner == '')
            throw 'GTIN can not be an empty string!';
        else if (commodity == '')
            throw 'commodity can not be an empty string!';

        transfer.commodity.owner = transfer.newOwner;
        const commodityAssetRegistry = await getAssetRegistry('org.logistics.testnet.Commodity');
        await commodityAssetRegistry.update(transfer.commodity);


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
 * 
 * @param {org.logistics.testnet.CreateCommodity} commodity - the CreateCommodity transaction
 * @transaction
 */
 async function createCommodity(commodity) {
    var owner = commodity.owner;
    var GTIN = commodity.GTIN;

    // INTEGRITY CHECKS
    if (GTIN == '') {
        throw 'GTIN can not be an empty string!';
    }


    // Get the vehicle asset registry.
    return getAssetRegistry('org.logistics.testnet.Commodity')
    .then(function(commodityAssetRegistry) {

            // Get the factory for creating new asset instances.
            var factory = getFactory();
            // Create the vehicle.
            //var safeMax = Number.MAX_SAFE_INTEGER;
            //Math.floor((Math.random() * safeMax) + 1);
            //var commodityId = 'COMMODITY_' + owner + getAll
            var newCommodity = factory.newResource('org.logistics.testnet', 'Commodity', GTIN);
            newCommodity.owner = owner;
            //console.log('test: ' + GTIN)
            newCommodity.GTIN = GTIN;
            newCommodity.name = 'Wood';
            newCommodity.description = 'A piece of wood';
            // Add the vehicle to the vehicle asset registry.
            return commodityAssetRegistry.add(newCommodity);
        })
    .catch(function(error) {
        console.log(error);
            // Add optional error handling here.
            throw error;
        });
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
    const shipmentRegistry = await getAssetRegistry('org.logistics.testnet.Shipment');
    await shipmentRegistry.update(shipment);
}

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.logistics.testnet.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) { // eslint-disable-line no-unused-vars

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
}
