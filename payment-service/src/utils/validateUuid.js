import { version, validate } from "uuid";

export function validateUuid(uuid,expectedVersion = 4) {
    return validate(uuid) && version(uuid) == expectedVersion;
}