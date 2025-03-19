import mongoose from "mongoose";

const userServiceReqSchema = new mongoose.Schema({
    user_id: { type: String, nullable: true, default: null },
    user_email: {type: String, nullable: true, default: null},
    url: String,
    method: String,
    body: Object,
    created_at: {type: Date, default: Date.now()}
});

const userServiceResSchema = new mongoose.Schema({
    user_id: { type: String, nullable: true, default: null },
    user_email: { type: String, nullable: true, default: null },
    message:{ type: String, nullable: true},
    url: String,
    method: String,
    status_code: Number,
    data: { type: Object, nullable: true},
    created_at: { type: Date, default: Date.now() }
});

export const userServiceRequestDoc = mongoose.model('user_service_requests_doc', userServiceReqSchema);
export const userServiceResponseDoc = mongoose.model('user_service_responses_doc', userServiceResSchema);