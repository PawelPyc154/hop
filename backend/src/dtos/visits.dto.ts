import { IsString } from "class-validator";

export class CreateVisitDto {
  @IsString()
  public serviceId: string;

  @IsString()
  public placeId: string;
  @IsString()
  public visitDate: Date;
}
