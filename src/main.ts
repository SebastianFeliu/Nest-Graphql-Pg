import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(port);
  logger.log(`App running on port: ${port}`);
  logger.log(`GraphQL Playground available at: http://localhost:${port}/graphql`);
}
bootstrap();
