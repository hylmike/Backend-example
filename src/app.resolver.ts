import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query()
  sayHello(): string {
    return 'Hello, GraphQL is runing';
  }
}
