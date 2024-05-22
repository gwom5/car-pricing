import { Expose, Transform } from "class-transformer";

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    approved: boolean;

    // obj is entire report instance. get the user's id from there instead of returning entire user.
    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}