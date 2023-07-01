import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  NotFoundException,
  UsePipes,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Inventory } from './entities/inventory.entity';
import {
  AddInventoryResponseDto,
  CreateInventoryRequestDto,
  DeleteInventoryResponseDto,
  GetAllInventoryResponseDto,
  GetInventoryByIdResponseDto,
  UpdateInventoryRequestDto,
} from './dto';

@Controller('inventory')
@ApiTags('Inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UsePipes(ValidationPipe)
  @Post('create')
  @ApiOperation({ description: 'Create a new Inventory' })
  @ApiCreatedResponse({ type: Inventory })
  @HttpCode(201)
  async createInventory(
    @Body() InventoryDto: CreateInventoryRequestDto,
  ): Promise<AddInventoryResponseDto> {
    const response: AddInventoryResponseDto =
      await this.inventoryService.createInventory(InventoryDto);
    return response;
  }

  @Get()
  @ApiOkResponse({ type: Inventory, isArray: true })
  @HttpCode(200)
  async findAllInventories(): Promise<GetAllInventoryResponseDto> {
    const response: GetAllInventoryResponseDto =
      new GetAllInventoryResponseDto();
    const data: Inventory[] = await this.inventoryService.getAllInventories();

    response.status = 200;
    response.message = 'Success';
    response.data = data;
    response.pageSize = data.length;
    response.page = 1;
    response.sortBy = 'asc';
    return response;
  }

  @Get(':id')
  @ApiOkResponse({ type: Inventory })
  @HttpCode(200)
  async findAInventoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetInventoryByIdResponseDto> {
    const response: GetInventoryByIdResponseDto =
      new GetInventoryByIdResponseDto();
    const data: Inventory = await this.inventoryService.getInventoryById(id);
    if (!data) throw new NotFoundException(`Inventory with id ${id} not found`);

    response.status = 200;
    response.message = 'Success';
    response.data = data;
    return response;
  }

  @Patch(':id')
  @ApiOkResponse({ type: Inventory })
  @HttpCode(200)
  async updateInventoryById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryRequestDto,
  ): Promise<GetInventoryByIdResponseDto> {
    try {
      const data = await this.inventoryService.updateInventoryById(
        id,
        updateInventoryDto,
      );
      const response: GetInventoryByIdResponseDto =
        new GetInventoryByIdResponseDto();
      response.status = 200;
      response.message = 'Success';
      response.data = data;
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: inventory.controller.ts:90 ~ InventoryController ~ error:',
        error,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to update inventory.');
    }
  }

  @Delete(':id')
  @ApiOkResponse({ type: Inventory })
  @HttpCode(200)
  async removeInventoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteInventoryResponseDto> {
    try {
      const data = await this.inventoryService.deleteInventoryById(id);
      console.log(
        '🚀 ~ file: inventory.controller.ts:123 ~ InventoryController ~ data:',
        data,
      );
      const response: DeleteInventoryResponseDto =
        new DeleteInventoryResponseDto();
      response.status = 200;
      response.message = 'Success';
      response.data = data;
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
