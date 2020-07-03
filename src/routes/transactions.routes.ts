import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import { getCustomRepository } from 'typeorm';
import multer = require('multer');
import fs from 'fs';

const upload = multer()
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {

  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const transactions = await transactionsRepository.find({relations: ['category']})

  const balance = await transactionsRepository.getBalance()

  return response.json({
    "transactions": transactions,
    "balance": balance
  })
});

transactionsRouter.post('/', async (request, response) => {
  const {title, value, type, category} = request.body

  const createTransaction = new CreateTransactionService()

  const transaction = await createTransaction.execute({title, value, type, category})

  return response.json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  const {id} = request.params

  const deleteTransaction = new DeleteTransactionService()

  const transaction = await deleteTransaction.execute({id})

  return response.status(204).json()

});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const file = request.file

  const importTransaction = new ImportTransactionsService()

  const transactions = await importTransaction.execute({file})

  return response.json(transactions)

});

export default transactionsRouter;
