import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OpenAI } from 'openai';
import 'dotenv/config';
import {
  AIItem,
  Prisma,
  ItemStatus,
  PriorityStatus,
  UnitStatus,
  AiSuggestion as PrismaAiSuggestion,
} from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CategoryService } from 'src/category/category.service';
import {
  CategoryPriority,
  CategoryStatus,
} from 'src/category/dto/create-category.dto';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

@Injectable()
export class AiModelService {
  private openai: OpenAI | null = null;
  private openaiApiKey: string | null = null;
  private readonly model = 'gpt-4.1-mini';

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly categoryService: CategoryService,
  ) {
  }

  private getOpenAIClient(): OpenAI {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY is not configured on the server',
      );
    }
    if (!this.openai || this.openaiApiKey !== apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.openaiApiKey = apiKey;
    }
    return this.openai;
  }

  async fetchOpenAICompletion(userId: string, messages: ChatMessage[]) {
    try {
      const output = await this.getOpenAIClient().chat.completions.create({
        model: this.model,
        messages,
      });
      return await this.processAIGenratedData(userId, output.choices);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'OpenAI streaming failed',
      );
    }
  }

  async processAIGenratedData(userId, result: any) {
    const data = result[0]?.message?.content;
    const parsedData = JSON.parse(data);
    if (data) {
      const AiSuggestion = await this.createAiSuggestion(
        userId,
        parsedData.prompt,
      );
      const AiCategory = await this.createAiCategory(
        AiSuggestion.id,
        parsedData.category,
      );
      await this.createAiItem(parsedData.shopping_list, AiCategory.id);
      return await this.findShoppingList(AiSuggestion.id);
    } else {
      throw new InternalServerErrorException(
        'Failed to Generate AI Shopping Category, Retry again....',
      );
    }
  }

  async createAiSuggestion(userId, prompt) {
    try {
      return await this.databaseService.aiSuggestion.create({
        data: {
          prompt,
          userId: userId,
        } as Prisma.AiSuggestionCreateInput,
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('This Prompt Result already exists');
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid AI Prompt payload (missing or wrong field types).',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create AI Shopping Category',
      );
    }
  }

  async createAiCategory(suggestionId, categoryName) {
    try {
      return await this.databaseService.aICategory.create({
        data: {
          categoryName,
          AiSuggestion: { connect: { id: suggestionId } },
        },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('AI Shopping Category already exists');
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid AI Shopping Category payload (missing or wrong field types).',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create AI Shopping Category',
      );
    }
  }

  async createAiItem(shoppingList, categoryId) {
    try {
      if (!Array.isArray(shoppingList))
        throw new BadRequestException('Invalid shopping_list payload.');

      const unitMap: Record<string, UnitStatus> = {
        kg: UnitStatus.kg,
        kilogram: UnitStatus.kg,
        kilograms: UnitStatus.kg,
        g: UnitStatus.g,
        gram: UnitStatus.g,
        grams: UnitStatus.g,
        l: UnitStatus.l,
        liter: UnitStatus.l,
        litre: UnitStatus.l,
        liters: UnitStatus.l,
        litres: UnitStatus.l,
        ml: UnitStatus.ml,
        milliliter: UnitStatus.ml,
        millilitre: UnitStatus.ml,
        milliliters: UnitStatus.ml,
        millilitres: UnitStatus.ml,
        cup: UnitStatus.cup,
        cups: UnitStatus.cup,
        bottle: UnitStatus.bottle,
        bottles: UnitStatus.bottle,
        can: UnitStatus.can,
        cans: UnitStatus.can,
        pack: UnitStatus.pack,
        packs: UnitStatus.pack,
        dozen: UnitStatus.dozen,
        box: UnitStatus.box,
        boxes: UnitStatus.box,
        piece: UnitStatus.piece,
        pieces: UnitStatus.piece,
      };

      const itemsData: Prisma.AIItemCreateManyInput[] = shoppingList.map(
        (item) => {
          const rawUnit = typeof item.unit === 'string' ? item.unit.trim() : '';
          const normalizedUnit = rawUnit.toLowerCase();
          const quantity =
            item.quantity === null ||
            item.quantity === undefined ||
            Number.isNaN(Number(item.quantity))
              ? 1
              : Math.round(Number(item.quantity));
          const unit =
            normalizedUnit.length > 0
              ? (unitMap[normalizedUnit] ?? UnitStatus.other)
              : UnitStatus.other;
          return {
            itemName: item.item,
            quantity,
            unit,
            categoryId,
          };
        },
      );

      return await this.databaseService.aIItem.createMany({
        data: itemsData,
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('AI Shopping Item already exists');
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid AI Shopping Item payload (missing or wrong field types).',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create AI Shopping Item',
      );
    }
  }

  async findShoppingList(
    suggestionId: string,
  ): Promise<PrismaAiSuggestion | null> {
    return await this.databaseService.aiSuggestion.findUnique({
      where: {
        id: suggestionId,
      },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async findAll(userId: string): Promise<PrismaAiSuggestion[]> {
    return await this.databaseService.aiSuggestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async remove(catId: string) {
    try {
      await this.databaseService.$transaction([
        this.databaseService.aICategory.deleteMany({
          where: { id: catId },
        }),
        this.databaseService.aIItem.deleteMany({
          where: { categoryId: catId },
        }),
      ]);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('AI Shopping List could not found');
      }
      throw new InternalServerErrorException(
        'Failed to delete AI Shopping List',
      );
    }
  }

  async removeSuggestion(sugesId: string) {
    if (sugesId) {
      try {
        await this.databaseService.aiSuggestion.delete({
          where: { id: sugesId },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('AI Shopping Lists could not found');
        }
        throw new InternalServerErrorException(
          'Failed to delete AI Shopping Lists',
        );
      }
    }
  }

  async removeSuggestionByCategory(cateId: string) {
    const category = await this.databaseService.aICategory.findUnique({
      where: {
        id: cateId,
      },
    });
    await this.removeSuggestion(category?.suggestionId ?? '');
    return category;
  }

  async removeAIShoppingItem(categoryId: string, itemId: string) {
    try {
      await this.databaseService.aIItem.deleteMany({
        where: {
          id: itemId,
          categoryId: categoryId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('AI Shopping Item could not found');
      }
      throw new InternalServerErrorException(
        'Failed to delete AI Shopping Item',
      );
    }
  }

  async addShoppingItem(
    itemId,
    categoryId,
    itemName,
    itemQty,
    itemUnit,
  ): Promise<AIItem> {
    try {
      return await this.databaseService.aIItem.create({
        data: {
          id: itemId,
          itemName,
          quantity: itemQty,
          unit: itemUnit,
          priority: 'normal',
          AICategory: {connect: {id: categoryId}}
        } as Prisma.AIItemCreateInput,
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Shopping Item already exists');
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid Shopping Item payload (missing or wrong field types).',
        );
      }
      throw new InternalServerErrorException(`Failed to create Shopping Item`);
    }
  }
  async update(
    itemId,
    categoryId,
    itemName,
    itemQty,
    itemUnit,
  ): Promise<AIItem> {
    try {
      const { count } = await this.databaseService.aIItem.updateMany({
        where: { categoryId, id: itemId },
        data: {
          itemName,
          quantity: itemQty,
          unit: itemUnit,
        },
      });

      if (count === 0) {
        throw new NotFoundException(`Shopping Item '${itemId}' not found`);
      }

      const updated = await this.databaseService.aIItem.findUnique({
        where: { id: itemId },
      });
      if (!updated) {
        throw new NotFoundException(`Shopping Item '${categoryId}' not found`);
      }
      return updated;
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Invalid Shopping Item update payload (missing or wrong field types).',
        );
      }
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Unique constraint violation while updating Shopping Item',
        );
      }
      throw new InternalServerErrorException('Failed to update Shopping Item');
    }
  }

  async confirmAICatregoy(userId: string, cateId: string) {
    try {
      const aiCategory = await this.databaseService.aICategory.findUnique({
        where: {
          id: cateId,
        },
        include: {
          items: true,
          AiSuggestion: true,
        },
      });

      if (aiCategory && userId) {
        const category = await this.categoryService.create({
          categoryName: aiCategory.categoryName,
          description: '',
          priority: CategoryPriority.normal,
          status: CategoryStatus.active,
          icon: 'shopping_cart',
          userId,
        });
        if (aiCategory.items.length > 0) {
          const itemsData: Prisma.ShoppingItemCreateManyInput[] =
            aiCategory.items.map((item) => ({
              itemName: item.itemName,
              description: '',
              quantity:
                item.quantity === null || item.quantity === undefined
                  ? 1
                  : Math.max(1, Math.round(item.quantity)),
              unit: item.unit ?? UnitStatus.piece,
              status: ItemStatus.active,
              priority: item.priority ?? PriorityStatus.normal,
              categoryId: category.categoryId,
            }));
          await this.databaseService.shoppingItem.createMany({
            data: itemsData,
          });
        }
        return await this.removeSuggestionByCategory(cateId);
      } else {
        throw new NotFoundException('AI Shopping Category not found');
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('AI Shopping Category not found');
      }
      throw new InternalServerErrorException(
        'Failed to confirm AI Shopping Category',
      );
    }
  }
}
