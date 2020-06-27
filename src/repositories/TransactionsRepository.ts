import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO{
  title: string,
  value: number,
  type: 'income' | 'outcome'
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    // TODO
    return this.transactions
  }

  public getBalance(): Balance {
    // TODO
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0
    }

    this.transactions.map(transaction=>{
      if (transaction.type === 'outcome' ){
        balance.outcome += transaction.value
        balance.total -= transaction.value
      } else {
        balance.income += transaction.value
        balance.total += transaction.value
      }
    })

    return balance

  }

  public create({title, value, type}: TransactionDTO): Transaction {
    // TODO
    const transaction = new Transaction({title, value, type})

    const balance = this.getBalance()

    if (type == 'outcome'){
      if (balance.total < value){
        throw Error("You can't create this transaction because your balance will be negative")
      }

    }

    this.transactions.push(transaction)

    return transaction
  }
}

export default TransactionsRepository;
