import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

// import { User } from 'src/user/schemas';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string {
    let key = super.trackBy(context);
    if (key) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as any; // change to user type

      if (user) {
        key += user.id;
      }
    }

    return key;
  }
}
