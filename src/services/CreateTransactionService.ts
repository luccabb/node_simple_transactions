// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoryRepository';
import AppError from '../errors/AppError';

interface Request{
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction | AppError> {

    const transactionRepository = getCustomRepository(TransactionsRepository)
    const categoryRepository = getCustomRepository(CategoriesRepository)

    const findCategory = await categoryRepository.findOne({
      where: {title: category}
    })

    var categoryId

    if (findCategory) {
      categoryId = findCategory.id
    } else {

      const newCategory = categoryRepository.create({
        title: category
      })
      const savedCategory = await categoryRepository.save(newCategory)

      categoryId = savedCategory.id
    }

    const balance = await transactionRepository.getBalance()

    if (type == 'outcome' && balance.total < value){
      throw new AppError("Not enough funds", 400)
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryId
    })

    await transactionRepository.save(transaction)

    return transaction

  }
}

export default CreateTransactionService;
