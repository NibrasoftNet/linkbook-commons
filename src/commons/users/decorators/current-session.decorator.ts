import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtRefreshPayloadType } from '../types';

export const CurrentSession = createParamDecorator(
	(data: keyof JwtRefreshPayloadType | undefined, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req.user;
	},
);