import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';
import { log } from 'util';
import AppError from '../errors/AppError';

interface Request{
  file: any,
}

interface Dictionary<T> {
  [Key: string]: T;
}

interface DataFormat{
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

class ImportTransactionsService {


  async execute({file}: Request): Promise<(Transaction | AppError)[]> {

    var lines = file.buffer.toString().trim().split(/\r?\n/)

    lines = lines.map((line: any) =>(
      line.trim().split(',')
    ))

    lines = lines.map((line: Array<string>)=>(
      line.splice(0, lines.length)
    ))

    const header: Array<string> = lines.filter((itm: string, idx: number)=>{
      if (idx==0) {
        return itm
      }
    }).flat()


    const rows: Array<Dictionary<any>> = lines.splice(1, lines.length).map((line: string[])=>{
      const helper: Dictionary<any> = {}
      header.map((itm: string, idx: number)=>{

        if (header[idx].trim()=='value'){
          helper[header[idx].trim()] = parseInt(line[idx])
        } else {
          helper[header[idx].trim()] = line[idx].trim()
        }
      })

      return helper

    })

    const createTransactionService = new CreateTransactionService()

    var transactions = []
    for (const row of rows) {
      const transaction: Transaction | AppError = await Promise.resolve(createTransactionService.execute({
        title: row.title,
        type: row.type,
        value: row.value,
        category: row.category
      }))

      transactions.push(transaction)

    }

    return transactions
  }
}

export default ImportTransactionsService;
