import {config} from "dotenv";
import {initializeApp} from "firebase-admin/app";

let initialized = false;

/**
 * Setup the environment
 */
export default function setup() {
    if (initialized) return;
    initialized = true;
    config();
    initializeApp();
}
