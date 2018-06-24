import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.logistics.testnet{
   export enum ProductType {
      FOOD,
      MEDICINE,
      MACHINES,
      OTHER,
   }
   export enum ItemStatus {
      GOOD,
      DAMAGED,
      CRITICAL,
   }
   export enum TransformationType {
      JOIN,
      SPLIT,
      UPGRADE,
   }
   export enum ShipmentStatus {
      WAITING,
      PACKING,
      DISPATCHING,
      SHIPPED_IN_TRANSIT,
      CANCELED,
      DELIVERED,
      RECEIVED,
      LOST,
   }
   export abstract class ShipmentTransaction extends Transaction {
      shipment: ShipmentBatch;
   }
   export class TemperatureReading extends ShipmentTransaction {
      centigrade: number;
   }
   export class CreateShipmentAndContract extends Transaction {
      shipmentId: string;
      trackingNumber: string;
      message: string;
      status: ShipmentStatus;
      location: Location;
      owner: supplyChainMember;
      assetExchanged: Commodity[];
      orderId: string;
      buyer: supplyChainMember;
      expectedArrivalLocation: Location;
      payOnArrival: boolean;
      arrivalDateTime: Date;
      paymentPrice: number;
   }
   export class UpdateShipment extends ShipmentTransaction {
      status: ShipmentStatus;
      newLocation: Location;
      message: string;
      newHolder: supplyChainMember;
   }
   export class TransferCommodityPossession extends Transaction {
      commodity: Commodity;
      newOwner: supplyChainMember;
   }
   export class ReportDamagedGood extends Transaction {
      damagedGood: Commodity;
      dateOccurred: Date;
      dateReported: Date;
      occurrenceDescription: string;
      itemConditionDescription: string;
      itemStatus: ItemStatus;
   }
   export class TransformCommodities extends Transaction {
      commoditiesToBeConsumed: Commodity[];
      commoditiesToBeCreated: Commodity[];
   }
   export class Commodity extends Asset {
      type: ProductType;
      GTIN: string;
      name: string;
      description: string;
      itemCondition: ItemCondition;
      owner: supplyChainMember;
   }
   export class ShipmentBatch extends Asset {
      shipmentId: string;
      trackingNumber: string;
      message: string;
      status: ShipmentStatus;
      location: Location;
      temperatureReadings: TemperatureReading[];
      owner: supplyChainMember;
      holder: supplyChainMember;
      contract: OrderContract;
      assetExchanged: Commodity[];
   }
   export class OrderContract extends Asset {
      orderId: string;
      buyer: supplyChainMember;
      seller: supplyChainMember;
      expectedArrivalLocation: Location;
      payOnArrival: boolean;
      arrivalDateTime: Date;
      paymentPrice: number;
   }
   export class ItemCondition {
      conditionDescription: string;
      status: ItemStatus;
   }
   export class Address {
      city: string;
      country: string;
      street: string;
      zip: string;
   }
   export class Location {
      globalLN: string;
      address: Address;
   }
   export abstract class supplyChainMember extends Participant {
      gs1CompanyPrefix: string;
      email: string;
      address: Address;
      accountBalance: number;
   }
   export class Supplier extends supplyChainMember {
   }
   export class Manufacturer extends supplyChainMember {
   }
   export class Distributor extends supplyChainMember {
   }
   export class Retailer extends supplyChainMember {
   }
   export class Customer extends supplyChainMember {
   }
   export class Auditor extends Participant {
      auditorCompany: string;
      email: string;
      address: Address;
   }
   export class SetupDemo extends Transaction {
   }
   export class TestTransaction extends Transaction {
      shipment: ShipmentBatch;
      commodity: Commodity;
   }
   export class TestEvent extends Event {
      eventString: string;
   }
   export class changeOwnershipEvent extends Event {
      commodity: Commodity;
      newOwner: supplyChainMember;
      oldOwner: supplyChainMember;
   }
   export class detectLocationFraud extends Event {
      newLocation: Location;
      expectedArrivalLocation: Location;
      shipment: ShipmentBatch;
   }
   export class CommodityTransformation extends Event {
      oldCommodities: Commodity[];
      newCommodities: Commodity[];
   }
   export class TradeNotification extends Event {
      commodity: Commodity;
   }
   export class RemoveNotification extends Event {
      commodity: Commodity;
   }
// }
