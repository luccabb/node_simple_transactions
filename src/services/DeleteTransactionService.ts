// import AppError from '../errors/AppError';
import { getCustomRepository, DeleteResult } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { response } from 'express';

interface Request {
  id: string
}

class DeleteTransactionService {
  public async execute({id}: Request): Promise<DeleteResult> {
    const transactionRepository = getCustomRepository(TransactionsRepository)

    const transaction = await transactionRepository.delete(id)

    return transaction

  }
}

export default DeleteTransactionService;
