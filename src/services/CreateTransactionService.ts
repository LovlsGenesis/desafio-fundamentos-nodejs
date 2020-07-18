import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  type: 'outcome' | 'income';
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error(`Transaction type invalid: ${type}`);
    }
    const { total } = this.transactionsRepository.getBalance();

    if (total - value < 0 && type === 'outcome') {
      throw Error("Can't make transaction. Your balance is negative");
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
