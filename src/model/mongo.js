"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let now;

const userSchema = new Schema({
    user_uid: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String },
    mobile: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },    
    created_by: { type: String },
    updated_by: { type: String },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

userSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const countSchema = new Schema({
    addCount: { type: Number, default: 0 }, 
    updateCount: { type: Number, default: 0 }, 
  });
  


module.exports = {
    user: mongoose.model("user", userSchema),
    count: mongoose.model("count", countSchema)
}