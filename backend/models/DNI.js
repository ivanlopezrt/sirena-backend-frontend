const crypto = require("crypto");

class DNI {
    #isValidDNI;
    #dni;

    constructor(dni) {
        this.#dni = dni;
        this.#isValidDNI = this.#validateDNI();
    }

    #validateDNI() {
        if (!this.#dni || this.#dni === '') {
            return false;
        }

        const regex = /^(\d{8})([A-Z])$/;
        const match = this.#dni.match(regex);
        if (!match) {
            return false;
        }
        const [_, numeros, letra] = match;
        const numerosDNI = parseInt(numeros, 10);
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letraCalculada = letras.charAt(numerosDNI % 23);

        return letra === letraCalculada;
    }

    isValid() {
        return this.#isValidDNI;
    }

    hashDNI() {

        if (!this.isValid()) {
            return ""
        }

        const additionalString = process.env.DNI_SECRET_KEY;
        const sha256 = crypto.createHash('sha256');
        sha256.update(this.#dni + additionalString);
        return sha256.digest('hex');
    }
}

module.exports = DNI;
