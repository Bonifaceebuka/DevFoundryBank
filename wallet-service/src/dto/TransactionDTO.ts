import { Transaction } from "typeorm";
import { TransactionKind, TransactionStatus, TransactionType } from "../common/enums";

export class PeformFundsTransfer {
    amount!: string;
    user_id!: string;
    account_number!: string
}

export class NewTransactionDTO{
    reference!: string;
    user_id!: string;
    name!: string;
    opening_balance!: string;
    new_balance!: string;
    type!: TransactionType;
    kind!: TransactionKind;
    status!: TransactionStatus;
}