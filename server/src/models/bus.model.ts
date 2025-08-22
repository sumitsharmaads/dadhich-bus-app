import mongoose, { Document, Model, Schema } from 'mongoose';

export type BusType = 'seater' | 'sleeper' | 'mixed';

export interface SeatLayoutCell {
  row: number;
  col: number;
  type?: 'seat' | 'berth' | 'aisle' | 'empty';
  code?: string; // e.g., A1, U1
}

export interface BusDocument extends Document {
  name: string;
  registrationNumber: string; // unique bus number plate
  capacity: number;
  totalSeats?: number;
  type: BusType;
  ac: boolean;
  amenities?: string[]; // wifi, charging, blanket, water, tv, music, gps
  images?: { url?: string; id?: string; caption?: string }[];
  operator?: { name?: string; contactEmail?: string; contactPhone?: string };
  seatLayout?: {
    rows?: number;
    cols?: number;
    layout?: SeatLayoutCell[];
  };
  notes?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusModel extends Model<BusDocument> {}

const SeatLayoutCellSchema = new Schema<SeatLayoutCell>(
  {
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    type: { type: String, enum: ['seat', 'berth', 'aisle', 'empty'], default: 'seat' },
    code: String,
  },
  { _id: false },
);

const BusSchema = new Schema<BusDocument, BusModel>(
  {
    name: { type: String, required: true, index: true },
    registrationNumber: { type: String, required: true, unique: true, index: true },
    capacity: { type: Number, required: true },
    totalSeats: { type: Number },
    type: { type: String, enum: ['seater', 'sleeper', 'mixed'], default: 'seater' },
    ac: { type: Boolean, default: true },
    amenities: { type: [String], default: [] },
    images: [{ url: String, id: String, caption: String }],
    operator: { name: String, contactEmail: String, contactPhone: String },
    seatLayout: {
      rows: Number,
      cols: Number,
      layout: { type: [SeatLayoutCellSchema], default: [] },
    },
    notes: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

BusSchema.pre('save', function (next) {
  if (this.isModified('capacity') && (this as any).totalSeats == null) {
    (this as any).totalSeats = (this as any).capacity;
  }
  next();
});

export const Bus = mongoose.model<BusDocument, BusModel>('Bus', BusSchema);
