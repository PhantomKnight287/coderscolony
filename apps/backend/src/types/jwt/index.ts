import { Jwt } from 'jsonwebtoken';

export interface DecodedJWT extends Jwt {
  id: string;
}
