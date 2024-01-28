export type JwtPayloadType = {
  id: number;
  role: {
    createdAt: string;
    updatedAt: string;
    id: number;
    name: string;
    __entity: 'Role';
  };
  sessionId: number;
  iat: number;
  exp: number;
};
