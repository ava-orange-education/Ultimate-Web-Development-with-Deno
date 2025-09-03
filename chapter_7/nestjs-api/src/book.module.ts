import { Module } from "npm:@nestjs/common";
import { BookController } from "./book.controller.ts";
import { BookService } from "./book.service.ts";

// Placeholder for Book entity
class Book {}

// Placeholder for TypeOrmModule
// This is a mock to satisfy the NestJS module system's typings.
class TypeOrmFeatureModule {}

const TypeOrmModule = {
  forFeature: (entities: any[]) => {
    console.log('TypeOrmModule.forFeature called with:', entities);
    // Return a structure that resembles a DynamicModule
    return {
        module: TypeOrmFeatureModule,
        providers: [],
        exports: [],
    };
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService]
})
export class BookModule {}
