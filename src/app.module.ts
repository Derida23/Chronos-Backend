import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [AuthModule, CategoryModule, ProfileModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
