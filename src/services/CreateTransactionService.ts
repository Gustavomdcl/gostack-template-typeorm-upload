import AppError from '../errors/AppError';
import {getCustomRepository,getRepository} from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income'|'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title,value,type,category}:RequestDTO): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();
    if(balance.total<value&&type==='outcome'){
      throw new AppError(`Your transaction's outcome value is higher than your total.`);
    }

    var checkCategoryExists = await categoriesRepository.findOne({ where: {title:category} });
    if(!checkCategoryExists){
      checkCategoryExists = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(checkCategoryExists);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
