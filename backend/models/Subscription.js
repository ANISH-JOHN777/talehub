const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'payment_failed'],
      default: 'active',
    },
    currentPeriodStart: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    pricePerMonth: {
      type: Number,
      default: 0,
    },
    features: {
      unlimitedBooksPerMonth: { type: Boolean, default: false },
      premiumBooks: { type: Boolean, default: false },
      aiRecommendations: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      groupSessions: { type: Boolean, default: false },
      certificatesOnCompletion: { type: Boolean, default: false },
      recordedSessions: { type: Boolean, default: false },
      analyticsAndStats: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
)

SubscriptionSchema.index({ user: 1 })
SubscriptionSchema.index({ stripeCustomerId: 1 })

module.exports = mongoose.model('Subscription', SubscriptionSchema)
