import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class Repository<T> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id: Number(id) } });
  }

  async findFirst(filter: any): Promise<T | null> {
    return this.model.findFirst({ where: filter });
  }


  async findMany(
    options?: any
  ): Promise<T[]> {
    return this.model.findMany(options || {});
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.model.delete({ where: { id: Number(id) } });
    return true;
  }

}
