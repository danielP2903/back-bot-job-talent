import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterviewsModule } from './interviews/interviews.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomExceptionFilter } from './shared/filters/exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { configApp } from './config/configuration';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { DatabaseModule } from './database/database.module';
import { QuestionsModule } from './questions/questions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InformationInterceptor } from './shared/interceptors/information/information.interceptor';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    InterviewsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configApp],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    QuestionsModule,
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InformationInterceptor,
    },
  ],
})
export class AppModule {}
