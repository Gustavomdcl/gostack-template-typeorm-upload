import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  file: string;
}

class ImportTransactionsService {
  async execute({file}:RequestDTO): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory,file);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);

    const lines:any[] = [];
    parseCSV.on('data', line => {
      lines.push(line);
    });
    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions = [];
    for (const i in lines) {
      const [title,type,value,category] = lines[i];
      const createTransaction = new CreateTransactionService();
      const transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
