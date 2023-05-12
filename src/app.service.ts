import { Injectable } from '@nestjs/common';
import { Transaction } from './interfaces/app.transaction';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  normalizarLinha(file: Express.Multer.File) {
    const tempFilePath = `/tmp/${randomUUID}`;
    const fileContent = file.buffer.toString('utf-8');

    fs.writeFile(tempFilePath, fileContent, 'utf-8', (err) => {
      if (err) {
        console.error(`Erro ao escrever arquivo temporário: ${err.message}`);
        return;
      }

      fs.readFile(tempFilePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Erro ao ler arquivo temporário: ${err.message}`);
          return;
        }

        const linhas = data.split('\n');
        for (const linha of linhas) {
          const tipo = linha.substring(0, 2);
          const data = linha.substring(2, 12);
          const produto = linha.substring(12, 40).trim();
          const descricao = linha.substring(40, 60).trim();
          const valor = parseInt(linha.substring(60, 70));
          const vendedor = linha.substring(70).trim();

          const transaction: Transaction = {
            tipo,
            data,
            produto,
            descricao,
            valor,
            vendedor,
          };

          console.log(transaction);
        }

        // exclui o arquivo temporário
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error(`Erro ao excluir arquivo temporário: ${err.message}`);
          }
        });
      });
    });
  }
}
