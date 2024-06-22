import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Collapse, Flex, Form, FormProps, Tooltip} from "antd";
import AirPortSelect from "../AirPortSelect/AirPortSelect.tsx";
import DatesSelect from "../DatesSelect/DatesSelect.tsx";
import {SearchOutlined, SwapOutlined} from "@ant-design/icons";
import AdditionalSearch from "../AdditionalSearch/AdditionalSearch.tsx";
import ModalChat from "../ModalChat/ModalChat.tsx";
import {Airport, SearchDto} from "../../api/Types/types.ts";
import {useNavigate} from "react-router-dom";

import './TicketSearch.css'
import requests from "../../api/Requests/FlightApi.ts";
import {UserContext} from "../../main.tsx";

export interface TicketSearchProps {
    title?: string;
    values?: SearchDto;
    disabled?: boolean;
}

const TicketSearch = ({title, values, disabled}: TicketSearchProps): React.ReactElement => {
    const {city, setCity} = useContext(UserContext);
    const navigate = useNavigate();

    const [form] = Form.useForm<SearchDto>();
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [airportsFromBackend, setAirportsFromBackend] = useState<Array<Airport>>([]);
    const [userCity, setUserCity] = useState<string>();

    const [localDisable, setLocalDisable] = useState<boolean>(false);

    const [airportsFiltered, setAirportsFiltered] = useState<Array<Airport>>(airportsFromBackend);
    const departureAirport = Form.useWatch('departurePoint', form)
    const destinationAirport = Form.useWatch('destinationPoint', form)

    useEffect(() => {
        setLocalDisable(true)
        requests.getAirports()
            .then(req => {
                if (req instanceof Array) {
                    setAirportsFromBackend(req.map(x => {
                        x.value = x.label
                        return x
                    }))
                    setAirportsFiltered(req.map(x => {
                        x.value = x.label
                        return x
                    }))

                    !city && !values && window.navigator.geolocation
                        .getCurrentPosition(callback => {
                            const coords = {
                                lat: callback.coords.latitude,
                                lng: callback.coords.longitude,
                            }
                            const city = req.map(airport => {
                                const latDelta = Math.abs(coords.lat - airport.latitude)
                                const lngDelta = Math.abs(coords.lng - airport.longitude)

                                return {
                                    delta: latDelta + lngDelta,
                                    airport,
                                }
                            }).sort((a, b) => a.delta - b.delta)[0]

                            setUserCity(city.airport.value)
                            setCity(city.airport.label.split(",")[0])
                        })
                    city && !values && setUserCity(req.find(airport => airport.label.includes(city))?.value)
                }
                setLocalDisable(false)
            })
    }, []);

    useEffect(() => {
        userCity && form.setFieldValue("departurePoint", userCity)
    }, [userCity, form]);

    useEffect(() => {
        if (values && typeof values?.departurePoint == 'string') {
            form.setFieldValue('departurePoint', values.departurePoint);
        }
        if (values && typeof values?.destinationPoint == 'string') {
            form.setFieldValue('destinationPoint', values.destinationPoint);
        }
    }, [form, values]);

    useEffect(() => {
        setAirportsFiltered(airports => {
            airports.forEach(x => {
                x.disabled = x.value === departureAirport || x.value === destinationAirport;
            })
            return airports;
        })
    }, [departureAirport, destinationAirport]);

    const onSwap = () => {
        const oldTo = form.getFieldValue('departurePoint');
        const oldFrom = form.getFieldValue('destinationPoint');

        form.setFieldValue('departurePoint', oldFrom);
        form.setFieldValue('destinationPoint', oldTo);
    }

    const onFinish: FormProps<SearchDto>['onFinish'] = (values) => navigate('/search', {state: values});

    return (
        <Card className="p-3 rounded-4 search" bordered>
            <Form
                disabled={disabled || localDisable}
                form={form}
                initialValues={{
                    departurePoint: values?.departurePoint ?? null,
                    destinationPoint: values?.destinationPoint ?? null,
                    departureDate: values?.departureDate ?? "",
                    returnDate: values?.returnDate ?? "",
                    countEconomic: values?.countEconomic ?? 1,
                    countBusiness: values?.countBusiness ?? 0,
                    withPet: values?.withPet ?? false,
                    useGeneticAlg: values?.useGeneticAlg ?? false,
                }}
                onFinish={onFinish}
            >
                <p className="h3 fw-light text-center mb-3">{title ?? ""}</p>
                <Flex gap='small' className="flex-wrap">
                    <AirPortSelect
                        airports={airportsFiltered}
                        formName='departurePoint'
                        placeholder='Откуда'
                    />
                    <Tooltip title="Изменить направление" placement="bottom">
                        <Button icon={<SwapOutlined/>} onClick={onSwap}/>
                    </Tooltip>
                    <AirPortSelect
                        airports={airportsFiltered}
                        formName='destinationPoint'
                        placeholder='Куда'
                    />
                    <Flex gap='small' className="flex-fill">
                        <DatesSelect form={form}/>
                        <Form.Item<SearchDto> className='m-0'>
                            <Button type='primary' icon={<SearchOutlined/>} htmlType='submit'/>
                        </Form.Item>
                    </Flex>
                </Flex>
                <Collapse
                    className="mt-2"
                    size="small"
                    items={[{key: '1', label: 'Расширенный поиск', forceRender: true, children: (<AdditionalSearch form={form}/>)}]}
                />
                <Flex justify='center' className="mt-2">
                    <Button type='link' onClick={() => {
                        setOpenChat(true)
                    }}>Не знаете куда полететь? 🛩️</Button>
                </Flex>
            </Form>
            <ModalChat visible={openChat} onClose={() => setOpenChat(false)}/>
        </Card>
    );
};

export default TicketSearch;