import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDTO } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger("ProductsService")

  onModuleInit() {
      this.$connect()
      this.logger.log("Database connected");
      
  }

  create(createProductDto: CreateProductDto) {
   return this.product.create({
    data:createProductDto
   })
  }

  async findAll(paginationDTO:PaginationDTO) {
    const {limit,page} = paginationDTO

    const totalPages = await this.product.count({where:{available:true}})
    const lastPage = Math.ceil(totalPages / limit)

    return {
      data: await this.product.findMany({
        skip:(page-1)*limit,
        take:limit,
        where:{available:true}
      }),
      meta:{
        total:totalPages,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where:{id,available:true}
    })
    if(!product) throw new NotFoundException("El producto con id "+id+" no fue encontrado")
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id:_,...data} = updateProductDto

    if(Object.keys(updateProductDto).length === 0){
       throw new BadRequestException("Se necesita por lo menos un dato para actualizar")
    }
    await this.findOne(id)

    return this.product.update({
      where:{id},
      data
    })

  }

  async remove(id: number) {
    await this.findOne(id)

    const product = await this.product.update({
      where:{id},
     data:{
      available: false
     }
    })
   return product
  }
}
