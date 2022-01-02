import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import {
  RegWorkshopInput,
  Subscriber,
  SubWorkshopInput,
  UpdateWorkshopInput,
  Workshop,
} from '../graphql';
import { WorkshopService } from './workshop.service';

@Resolver('Workshop')
export class WorkshopResolver {
  constructor(private readonly workshopService: WorkshopService) {}

  @Query('workshop')
  async getWorkshop(@Args('id') id: string): Promise<Workshop> {
    return this.workshopService.getWorkshop(id);
  }

  @Mutation()
  async regWorkshop(
    @Args('regWorkshopData') regWorkshopData: RegWorkshopInput,
  ): Promise<Workshop> {
    return this.workshopService.register(regWorkshopData);
  }

  @Mutation()
  async updateWorkshop(
    @Args('updateWorkshopData') updateWorkshopData: UpdateWorkshopInput,
  ): Promise<Workshop> {
    return this.workshopService.updateWorkshop(updateWorkshopData);
  }

  @Query('getWorkshopList')
  async getWorkshopList(@Args('num') num: number): Promise<Workshop[]> {
    return this.workshopService.getWsList(num);
  }

  @ResolveField('subscriber')
  async getSubList(@Parent() workshop: Workshop): Promise<Subscriber[]> {
    const { _id: workshopID } = workshop;
    return this.workshopService.getSubList(workshopID);
  }

  @Mutation()
  async subWorkshop(
    @Args('subWorkshopData') subWorkshopData: SubWorkshopInput,
  ): Promise<Subscriber> {
    return this.workshopService.subWorkshop(subWorkshopData);
  }

  @Mutation()
  async unsubWorkshop(@Args('id') id: string): Promise<Subscriber> {
    return this.workshopService.unsubWorkshop(id);
  }

  @Query()
  async getSubWorkshops(
    @Args('readerID') readerID: string,
  ): Promise<Workshop[]> {
    return this.workshopService.getSubWorkshops(readerID);
  }
}
