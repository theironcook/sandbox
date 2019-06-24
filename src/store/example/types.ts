import { Model } from '@/store/types'
import moment from 'moment';

export interface Example extends Model {    
  name: string,
  shortName: string,
  dateOfBirth: moment.Moment
};
