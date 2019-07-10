import { Model } from '@/store/types'
import moment from 'moment';

export interface Example extends Model {    
  newId: number,
  name: string,
  shortName: string,
  dateOfBirth: moment.Moment,
  weight: number
};
