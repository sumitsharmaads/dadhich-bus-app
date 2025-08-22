import { FilterQuery, UpdateQuery } from 'mongoose';
import { Country, CountryDocument } from '../models/country.model';
import { State, StateDocument } from '../models/state.model';
import { City, CityDocument } from '../models/city.model';

export const placeRepository = {
  // Country
  createCountry(data: Partial<CountryDocument>) {
    return Country.create(data);
  },
  updateCountry(id: string, data: UpdateQuery<CountryDocument>) {
    return Country.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  deleteCountry(id: string) {
    return Country.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },
  getCountry(id: string) {
    return Country.findById(id).exec();
  },
  listCountries(filter: FilterQuery<CountryDocument> = {}) {
    return Country.find({ isDeleted: false, ...filter })
      .sort({ name: 1 })
      .exec();
  },

  // State
  createState(data: Partial<StateDocument>) {
    return State.create(data);
  },
  updateState(id: string, data: UpdateQuery<StateDocument>) {
    return State.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  deleteState(id: string) {
    return State.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },
  getState(id: string) {
    return State.findById(id).exec();
  },
  listStates(filter: FilterQuery<StateDocument> = {}) {
    return State.find({ isDeleted: false, ...filter })
      .sort({ name: 1 })
      .exec();
  },

  // City
  createCity(data: Partial<CityDocument>) {
    return City.create(data);
  },
  updateCity(id: string, data: UpdateQuery<CityDocument>) {
    return City.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  deleteCity(id: string) {
    return City.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },
  getCity(id: string) {
    return City.findById(id).exec();
  },
  listCities(filter: FilterQuery<CityDocument> = {}) {
    return City.find({ isDeleted: false, ...filter })
      .populate('stateId', 'name code _id')
      .sort({ name: 1 })
      .exec();
  },
};
