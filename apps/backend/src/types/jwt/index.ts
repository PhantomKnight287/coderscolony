/* eslint-disable prettier/prettier */

import { Jwt } from 'jsonwebtoken';

export interface DecodedJWT extends Jwt {
  id: string;
}
