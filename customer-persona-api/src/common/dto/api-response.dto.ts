import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  data?: T;

  @ApiProperty({ example: null })
  error?: string | null;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
    this.error = error || null;
  }

  static success<T>(data: T, message = 'Operation completed successfully'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(true, message, data);
  }

  static error<T>(message: string, error?: string): ApiResponseDto<T> {
    return new ApiResponseDto<T>(false, message, undefined, error);
  }
}