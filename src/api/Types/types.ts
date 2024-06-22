export type AirplaneModel = "AIRBUS320" | "AIRBUS330"

export interface Airport {
    id?: number;
    value: string;
    label: string;
    timezone: string;
    latitude: number;
    longitude: number;
    disabled?: boolean;
}

export interface EditUserDto {
    gender: "FEMALE" | "MALE";
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: string;
    passport: string;
    residenceCity: string;
    internationalPassportNum: string;
    internationalPassportDate: string;
}

export interface User {
    email: string | undefined;
    gender: "FEMALE" | "MALE" | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    phoneNumber: string | undefined;
    birthDate: string | undefined;
    passport: string | undefined;
    internationalPassportNum: string | undefined;
    internationalPassportDate: string | undefined;
}

export interface UserDto extends User {
    id: string | undefined;
    password: string | undefined;
    residenceCity: string | undefined;
    role: Role
}

export type PaymentMethod = "BANKCARD" | "CASH" | "SBP"

export interface FlightClientViewDto {
    id: string;
    departurePoint: string;
    destinationPoint: string;
    destinationDate: string;
    destinationTime: string;
    departureDate: string;
    departureTime: string;
    economyCost: number;
    businessCost: number;
    flightTime: number;
    model: AirplaneModel;
    flightFavorDtos: Array<FlightFavorDto>
}

export interface FlightFavorDto {
    id: string;
    name: string;
    cost: number;
    disabled?: boolean;
}

export interface FlightIdDto {
    flightId: string;
}

export interface JwtAuthenticationResponse {
    token: string;
}

export interface UserIdDto {
    userId: string;
}

export interface PurchaseDto {
    id: string;
    totalCost: number;
    paymentMethod: PaymentMethod;
    createDate: string;
    userEmail: string;
    state: "PAID" | "PROCESSING" | "CANCELED";
}

export type Role = "ROLE_CLIENT" | "ROLE_ADMIN" | undefined

export interface SearchDto {
    departurePoint: string;
    destinationPoint: string;
    departureDate: number;
    returnDate?: number;
    countBusiness: number;
    countEconomic: number;
    withPet: boolean;
    useGeneticAlg: boolean;
    model?: AirplaneModel;
}

export interface SearchViewDto {
    to: Array<FlightClientViewDto>;
    back: Array<FlightClientViewDto>;
}

export interface SignInUser {
    email: string;
    password: string;
}

export interface SignUpUser {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
}

export interface TicketDto {
    id: string;
    ticketType: "BUSINESS" | "ECONOMIC";
    seatNumber: string;
    flightId: string;
    costFlight: number;
    costFavors: number;
    isEmpty: boolean;
    canReturn: boolean;
}

export interface PurchaseGetDto {
    purchaseId: string;
}

export interface PurchaseCreateDto {
    paymentMethod: PaymentMethod;
    user: User;
    passengers: Array<User>;
    tickets: Array<string>
    isAuth: boolean;
}

export interface PlaceRequestDto {
    mood: "Positive" | "Negative";
    rubric: string;
}

export interface PlaceDto {
    city: string;
    airport: string;
    address: string;
    namePlace: string;
}

export interface MessageDto {
    moodType: "Positive" | "Negative";
    modelType: "LSTM" | "GRU" | "CNN" | "GigaChad";
    email: string;
    question: string;
}

export interface PasswordChangeDto {
    email: string;
}

export interface CodeEnterDto {
    code: string
}

export interface CodeCheckDto {
    email: string;
    code: string;
}

export type NewPasswordDto = {
    newPassword: string;
    passwordConfirm: string;
}

export interface PasswordChangeEmailDto extends NewPasswordDto {
    confirmation: string;
}

export type HeatMapParamsDto = {
    userId: string;
    airplaneModel: AirplaneModel;
}

export type HeatMapDto = {
    airplane: string;
    seats: Array<Record<string, number>>
    userSeats: Array<Record<string, number>>
}

export interface RouteDto {
    route: string;
    ticketCount: number;
}

export interface QuestionCountDto {
    Negative: Record<string, number>;
    Positive: Record<string, number>;
}

export type QuestionCountDataDto = Array<{
    name: string,
    negative: number,
    positive: number
}>

export const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

export type Month =
    "JANUARY"
    | "FEBRUARY"
    | "MARCH"
    | "APRIL"
    | "MAY"
    | "JUNE"
    | "JULY"
    | "AUGUST"
    | "SEPTEMBER"
    | "OCTOBER"
    | "NOVEMBER"
    | "DECEMBER";

export interface DateParamsDto {
    month: Month
    year: number;
}

export type PopularFavorDto = Record<string, number>;

export type PopularFavorDataDto = Array<{ name: string, value: number }>;

export type CountSalesDto = Array<{
    date: string;
    ticketCount: number;
}>;

export interface AverageCostDto {
    categories: {
        YOUNG: {
            male: number,
            female: number,
        },
        ELDERLY: {
            male: number,
            female: number,
        },
        MIDDLE_AGE_HIGH: {
            male: number,
            female: number,
        },
        MIDDLE_AGE_LOW: {
            male: number,
            female: number,
        },
    }
}

export type Category = "YOUNG" | "ELDERLY" | "MIDDLE_AGE_HIGH" | "MIDDLE_AGE_LOW"

export type AverageCostDataDto = Array<{
    category: Category;
    male: number;
    female: number;
}>

export interface TicketCount {
    BUSINESS: number,
    ECONOMIC: number
}

export interface AgeTicketDto {
    categories: {
        YOUNG: {
            male: TicketCount
            female: TicketCount
        },
        ELDERLY: {
            male: TicketCount
            female: TicketCount
        },
        MIDDLE_AGE_HIGH: {
            male: TicketCount
            female: TicketCount
        },
        MIDDLE_AGE_LOW: {
            male: TicketCount
            female: TicketCount
        },
    }
}

export type AgeTicketDataDto = Array<{
    category: Category;
    maleEconomic: number;
    femaleEconomic: number;
    maleBusiness: number;
    femaleBusiness: number;
}>

export interface CodeReturnParams {
    email: string;
    ticketId: string;
}

export interface CheckCodeParams {
    code: string;
    ticketId: string;
}