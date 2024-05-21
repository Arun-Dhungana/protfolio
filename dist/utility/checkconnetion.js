"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = void 0;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Perform a simple query, such as retrieving the first record from a table
            yield prisma.$queryRaw `SELECT 1`;
            console.log("Prisma connected to the database successfully.");
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.checkConnection = checkConnection;
