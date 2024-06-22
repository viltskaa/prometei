const host: string = import.meta.env.VITE_BACKEND_HOST
import { expect, test } from 'vitest'
import {get} from './BaseRequests.ts'
import {SearchDto, SearchViewDto} from "../Types/types.ts";

test('Search test', async () => {
    const value = await get<SearchDto, Array<SearchViewDto>>(`${host}/flight/search`, {
        departurePoint: "LED",
        destinationPoint: "GOJ",
        departureDate: 1717712181,
        countBusiness: 0,
        countEconomic: 1,
        withPet: false,
        useGeneticAlg: false,
        model: "AIRBUS320"
    })

    console.log(value)
    expect((value as Array<SearchViewDto>).length).greaterThanOrEqual(0);
})