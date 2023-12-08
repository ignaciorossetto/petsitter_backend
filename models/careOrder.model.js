import mongoose, { Schema } from "mongoose";

const careOrderCollection = "careOrder";

const rateSchema = new mongoose.Schema(
  {
    rate: Number,
    review: String,
  },
  {
    _id: false,
  }
);

const CareOrderSchema = new mongoose.Schema(
  {
    sitterId: {
      type: Schema.Types.ObjectId,
      ref: "sitters",
      required: true,
      immutable: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "users",
        required: true,
        immutable: true
    },
    petId: { 
        type: Schema.Types.ObjectId, 
        ref: "pets",
        required: true,
        immutable: true
    },
    dates: {
        type: [Date],
        required: true,
    },
    rate: rateSchema,
    pricePerDay: {
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "complete", "failed", "error"],
      default: "pending",
    },
    paymentInfo: {
      status: {
        type: String,
        enum: ["pending", "approved", "failed", "error"],
        default: "pending",
      },
      totalPrice: {
        type: Number,
        required: true
      },
      paymentId: String,
    },
    platformPayment: {
      status: {
        type: String,
        enum: ["pending", "approved", "failed", "error"],
        default: "pending",
      },
      paymentId: String,
      paymentAmount: Number,
      paymentDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const CareOrderModel = mongoose.model(
  careOrderCollection,
  CareOrderSchema
);
