"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DNI_instances, _DNI_isValidDNI, _DNI_dni, _DNI_validateDNI;
const crypto = require("crypto");
class DNI {
    constructor(dni) {
        _DNI_instances.add(this);
        _DNI_isValidDNI.set(this, void 0);
        _DNI_dni.set(this, void 0);
        __classPrivateFieldSet(this, _DNI_dni, dni, "f");
        __classPrivateFieldSet(this, _DNI_isValidDNI, __classPrivateFieldGet(this, _DNI_instances, "m", _DNI_validateDNI).call(this), "f");
    }
    isValid() {
        return __classPrivateFieldGet(this, _DNI_isValidDNI, "f");
    }
    hashDNI() {
        if (!this.isValid()) {
            return "";
        }
        const additionalString = process.env.DNI_SECRET_KEY;
        const sha256 = crypto.createHash('sha256');
        sha256.update(__classPrivateFieldGet(this, _DNI_dni, "f") + additionalString);
        return sha256.digest('hex');
    }
}
_DNI_isValidDNI = new WeakMap(), _DNI_dni = new WeakMap(), _DNI_instances = new WeakSet(), _DNI_validateDNI = function _DNI_validateDNI() {
    if (!__classPrivateFieldGet(this, _DNI_dni, "f") || __classPrivateFieldGet(this, _DNI_dni, "f") === '') {
        return false;
    }
    const regex = /^(\d{8})([A-Z])$/;
    const match = __classPrivateFieldGet(this, _DNI_dni, "f").match(regex);
    if (!match) {
        return false;
    }
    const [_, numeros, letra] = match;
    const numerosDNI = parseInt(numeros, 10);
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letraCalculada = letras.charAt(numerosDNI % 23);
    return letra === letraCalculada;
};
module.exports = DNI;
