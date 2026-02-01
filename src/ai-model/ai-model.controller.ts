import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AiModelService } from './ai-model.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('ai-model')
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) {}

  @UseGuards(AuthGuard)
  @Post()
  async getShoppingList(@Request() request) {
    const userPrompt = String(request.body?.prompt ?? '');
    const userId = request.user.userId;
    return this.generateAI(userPrompt, userId);
  }

  async generateAI(userPrompt, userId){
    const prompt = `
        You are an assistant for a smart grocery and shopping app called SmartCart.

        Your task is to convert a user's shopping intention into a structured shopping list.

        The intention may relate to cooking, cleaning, travel, daily needs, or general shopping.

        Rules:
        - Only include items that must be purchased.
        - Do NOT include instructions or explanations.
        - Return valid JSON only.
        - Do not include markdown or extra text.
        - Quantity must be numeric when possible; otherwise use "1".
        - Unit must be one of:
          kg, piece, pack, dozen, box, g, l, ml,
          bottle, can, cup, other

        Example:

        User input:
        I want to cook fried rice for 2 people

        Assistant output:
        {
          "prompt": "I want to cook fried rice for 2 people",
          "intent": "Cook Fried Rice",
          "category": "Cooking",
          "shopping_list": [
            { "item": "Rice", "quantity": "2", "unit": "cup" },
            { "item": "Eggs", "quantity": "2", "unit": "piece" },
            { "item": "Carrots", "quantity": "1", "unit": "cup" },
            { "item": "Green onions", "quantity": "1", "unit": "bunch" },
            { "item": "Soy sauce", "quantity": "2", "unit": "cup" },
            { "item": "Cooking oil", "quantity": "1", "unit": "bottle" }
          ]
        }

        User input:
        ${userPrompt}
        `;

    const messages = [
      {
        role: 'system' as const,
        content: prompt,
      },
    ];

    return await this.aiModelService.fetchOpenAICompletion(userId, messages);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() request) {
    const userId = request.user.userId;
    return await this.aiModelService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteAIShoppingItem/:categoryId/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAIShoppingItemCon(
    @Param('categoryId') categoryId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    await this.aiModelService.removeAIShoppingItem(categoryId, itemId);
  }

  @UseGuards(AuthGuard)
  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('categoryId')
    categoryId: string,
    @Request() request,
  ): Promise<void> {
    const userId = request.user.userId;
    await this.aiModelService.remove(categoryId);
  }

  @UseGuards(AuthGuard)
  @Delete('deleteAISuggestion/:suggestionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllCategory(
    @Param('suggestionId')
    suggestionId: string,
    @Request() request,
  ): Promise<void> {
    const userId = request.user.userId;
    await this.aiModelService.removeSuggestion(suggestionId);
  }

  @UseGuards(AuthGuard)
  @Post('addAIShoppingItem')
  async add(@Request() request) {
    const { itemId, categoryId, itemName, itemQty, itemUnit } = request.body;
    return await this.aiModelService.addShoppingItem(
      itemId,
      categoryId,
      itemName,
      itemQty,
      itemUnit,
    );
  }


  @UseGuards(AuthGuard)
  @Patch('updateAIShoppingItem')
  async update(@Request() request) {
    const { itemId, categoryId, itemName, itemQty, itemUnit } = request.body;
    await this.aiModelService.update(
      itemId,
      categoryId,
      itemName,
      itemQty,
      itemUnit,
    );
  }

  @UseGuards(AuthGuard)
  @Post('regenerateAIShopping')
  async regenerateAI(@Request() request) {
    const {suggestionId, prompt} = request.body;
    const userId = request.user.userId;
    await this.aiModelService.removeSuggestion(suggestionId);
    return this.generateAI(prompt, userId);
  }

  @UseGuards(AuthGuard)
  @Post('confirmAIShopping')
  async confirmAIShopping(@Request() request) {
    const userId = request.user.userId;
    const { cateId } = request.body;
    return await this.aiModelService.confirmAICatregoy(userId, cateId);
  }
}
