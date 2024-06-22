import React, {useEffect, useState} from 'react';
import {Card, Divider, Flex, Progress, Select, Switch, Typography} from "antd";
import {ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import TicketSearch from "../TickerSearch/TicketSearch.tsx";
import {FlightClientViewDto, SearchDto, SearchViewDto} from "../../api/Types/types.ts";
import {useLocation, useNavigate} from "react-router-dom";
import FlightApi from "../../api/Requests/FlightApi.ts";
import Flight from "../Flight/Flight.tsx";
import PurchaseModal from "../PurchaseModal/PurchaseModal.tsx";

const {Text} = Typography;

const containsFlight = (flights: Array<SearchViewDto>) => flights && flights.some(x => x.to.length > 0 || x.back.length > 0)

const SearchResult: React.FC = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    const [compactView, setCompactView] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [cooldown, setCooldown] = useState<number>(0);
    const [flights, setFlights] = useState<Array<SearchViewDto>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [resultSorting, setResultSorting] = useState<string>("");
    const [selectedFlight, setSelectedFlight] = useState<SearchViewDto | null>();

    useEffect(() => {
        !state && navigate('/')

        if (cooldown === 0) {
            setFlights([])
            setError(false);
            setLoading(true)
            FlightApi.search(state as SearchDto)
                .then(x => {
                    if (x instanceof Array) {
                        setFlights(x)
                    } else {
                        setError(true)
                        setCooldown(120)
                    }
                    setLoading(false)
                })
        } else {
            const interval = setInterval(() => {
                setCooldown(cld => cld - 1)
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [state, cooldown, navigate]);

    useEffect(() => {
        switch (resultSorting) {
            case "price_up":
                break;
            case "price_down":
                break;
            case "speed_up":
                break;
            case "speed_down":
                break;
        }
    }, [resultSorting])

    const onSelect = (flight: Array<FlightClientViewDto>,
                      flightBack: Array<FlightClientViewDto>) => {
        setSelectedFlight({
            to: flight,
            back: flightBack,
        })
    }

    const onClose = () => {
        setSelectedFlight(null)
    }

    return (
        <Flex className="h-100 mt-2" gap="small" vertical>
            <TicketSearch values={state} disabled={error || loading}/>
            <Flex justify='center' align='center' gap='middle' className='d-none d-md-flex'>
                {(!error && !loading && !flights) && (
                    <>
                        <Select
                            size='small'
                            value={resultSorting}
                            onChange={(value) => setResultSorting(value)}
                            style={{width: 200}}
                            placeholder="Сортировать по"
                            options={[
                                {value: 'price_up', label: 'Сначала дешевые'},
                                {value: 'price_down', label: 'Сначала дорогие'},
                                {value: 'speed_up', label: 'Сначала быстрые'},
                                {value: 'speed_down', label: 'Сначала долгие'},
                            ]}
                            optionRender={(option) => (
                                <Flex justify="space-between">
                                    <Text className=""> {option.label}</Text>
                                </Flex>
                            )}/>
                        <Divider type="vertical"/>
                        <Text>Компактный вид</Text>
                        <Switch value={compactView} onChange={() => setCompactView(x => !x)}/>
                    </>
                )}
            </Flex>
            {loading && (
                <Flex justify='center' align='center' gap='middle' vertical>
                    <LoadingOutlined className="h1"/>
                    <Text className='h5'>Загружаем данные с сервера</Text>
                </Flex>
            )}
            {error && (
                <Flex align='center' className='h-100' vertical>
                    <Card className='p-3' style={{width: '90vmin'}}>
                        <Flex align='center' justify='center' vertical>
                            <Flex justify='center'>
                                <ExclamationCircleOutlined className="h4 me-2"/>
                                <Text className='h3 text-center'>Ошибка соединения с сервером</Text>
                            </Flex>
                            <Text className='h5 text-center' type='secondary'>Попытка восстановления соединения
                                через <b>{cooldown}</b> секунд</Text>
                            <Progress percent={Math.floor(100 - cooldown / 120 * 100)}/>
                        </Flex>
                    </Card>
                </Flex>
            )}
            {(flights && containsFlight(flights)) && (
                <Flex vertical gap='middle' className='overflow-y-scroll'>
                    {flights.map((flight, index) => (
                        <Flight
                            key={index}
                            flight={flight.to}
                            flightBack={flight.back}
                            onSelect={onSelect}
                            compact={compactView}
                            withPet={state.withPet}
                        />
                    ))}
                </Flex>
            )}
            {flights && !error && !containsFlight(flights) && !loading && (
                <Card className='p-3'>
                    <Flex justify='center' align='center' gap='middle' vertical>
                        <Text className='h5 m-0 text-center'>К сожалению данные по вашему запросу не найдены</Text>
                    </Flex>
                </Card>
            )}
            {selectedFlight && <PurchaseModal
              search={{
                  flights: selectedFlight,
                  params: state
              }}
              open={!!selectedFlight}
              onClose={onClose}
            />}
        </Flex>
    );
};

export default SearchResult;