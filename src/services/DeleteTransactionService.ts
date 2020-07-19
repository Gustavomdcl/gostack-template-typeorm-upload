import {getRepository} from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface RequestDTO {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({transaction_id}:RequestDTO): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne(transaction_id);
    if(transaction) await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
