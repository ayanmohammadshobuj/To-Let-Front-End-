// src/app/features/property/models/property.model.ts
import { HouseDetails } from './house-details.model';
import { Address } from '../../user/models/address.model';
import { Location } from './location.model';
import { ServiceType } from './service-type.enum';
import { HouseType } from './house-type.enum';
import { Status } from './status.enum';

export interface Property {
  id: number;
  userId: string;
  title: string;
  description?: string;
  price?: number;
  imageUrls: string[];
  serviceType: ServiceType;
  houseType: HouseType;
  houseDetails: HouseDetails;
  address: Address;
  location: Location;
  availableFrom?: string;
  expiryDate?: string;
  createdAt: string;
  status: Status;
}
