import {v4 as uuid} from "uuid";

export function generateTraceId(){
    return uuid();
}