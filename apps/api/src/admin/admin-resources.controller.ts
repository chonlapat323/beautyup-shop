import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import type { ResourceName } from '@beautyup/types';
import { AdminGuard, CurrentUser } from '../auth/auth.guard.js';
import type { AuthUser } from '../auth/auth.service.js';
import { ResourceService } from '../common/resource.service.js';
import { isResource } from '../common/resources.js';

/** Generic CRUD for every resource in the @beautyup/types registry. */
@Controller('admin/resources/:resource')
@UseGuards(AdminGuard)
export class AdminResourcesController {
  constructor(private readonly resources: ResourceService) {}

  @Get()
  list(@Param('resource') resource: string, @Query('q') q?: string) {
    return this.resources.list(check(resource), { q });
  }

  @Get(':id')
  get(@Param('resource') resource: string, @Param('id') id: string) {
    return this.resources.get(check(resource), id);
  }

  @Post()
  create(@Param('resource') resource: string, @Body() body: unknown, @CurrentUser() user?: AuthUser) {
    return this.resources.create(check(resource), body, user);
  }

  @Put(':id')
  update(@Param('resource') resource: string, @Param('id') id: string, @Body() body: unknown, @CurrentUser() user?: AuthUser) {
    return this.resources.update(check(resource), id, body, user);
  }

  @Delete(':id')
  remove(@Param('resource') resource: string, @Param('id') id: string, @CurrentUser() user?: AuthUser) {
    return this.resources.remove(check(resource), id, user);
  }
}

function check(name: string): ResourceName {
  if (!isResource(name)) throw new NotFoundException(`Unknown resource "${name}"`);
  return name;
}
