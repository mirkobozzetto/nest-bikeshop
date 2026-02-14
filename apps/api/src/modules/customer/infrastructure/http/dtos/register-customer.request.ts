import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class RegisterCustomerRequest {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('FR')
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;
}
