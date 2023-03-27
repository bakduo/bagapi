import { Schema } from 'mongoose';
import { IItemFile } from '../data-layer/data-layer.interface';

export const ItemFileSchema = new Schema<IItemFile>({
  name: {
    type: String,
    required: true,
    default: '',
  },
  created: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  uuid: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    default: '',
  },
  modify: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  owner: {
    type: String,
    required: true,
    default: '',
  },
  timestamp: {
    type: Number,
    required: true,
    default: Math.floor(Date.now() / 1000),
  },
});
