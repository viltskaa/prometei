import {Button, Card, Divider, Flex, Modal, Popover, Steps, Tabs, Typography} from "antd";
import {
    Airport,
    FlightClientViewDto,
    FlightFavorDto, PurchaseCreateDto, SearchDto,
    SearchViewDto, TicketDto, User
} from "../../api/Types/types.ts";
import {useContext, useEffect, useState} from "react";
import FavorsSearch, {FavorDto} from "../FavorSearch/FavorsSearch.tsx";
import requests from "../../api/Requests/FlightApi.ts";
import ticketApi from "../../api/Requests/TicketApi.ts";
import {default as flightApi} from "../../api/Requests/FlightApi.ts"
import UserForm from "../UserForm/UserForm.tsx";
import {UserContext} from "../../main.tsx";
import PaymentPage from "../PaymentPage/PaymentPage.tsx";
import {LoadingOutlined, WarningOutlined} from "@ant-design/icons";

import dayjs from "dayjs";
import 'dayjs/locale/ru';
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('ru');
dayjs.extend(customParseFormat);
dayjs.extend(utc)
dayjs.extend(timezone)

const {Text} = Typography;

const Fact = ({title, fact}: { title: string, fact: string }) => {
    return (
        <div className="d-flex justify-content-between mb-2">
            <span className='fw-bold'>{title}</span>
            <span>{fact}</span>
        </div>
    )
}

const facts = {
    AIRBUS320: [
        <Fact key={"f3201"} title="Первый полет" fact="22 февраля 1987 года"/>,
        <Fact key={"f3202"} title="Крейсерская скорость" fact="840 км/ч"/>,
        <Fact key={"f3203"} title="Вместимость" fact="116 человек"/>,
        <Fact key={"f3204"} title="Максимальная дальность" fact="6650 км"/>
    ],
    AIRBUS330: [
        <Fact key={"f3301"} title="Первый полет" fact="15 июня 2007 года"/>,
        <Fact key={"f3302"} title="Крейсерская скорость" fact="880 км/ч"/>,
        <Fact key={"f3303"} title="Вместимость" fact="292 человека"/>,
        <Fact key={"f3304"} title="Максимальная дальность" fact="8200 км"/>
    ]
}

interface PurchaseModalProps {
    search: {
        flights: SearchViewDto,
        params: SearchDto
    };
    open: boolean;
    onClose?: () => void
}

const getFlightCostEconomy = (flights: FlightClientViewDto[]) => {
    return flights && flights.length > 0 ? Math.ceil(flights.map(x => x.economyCost).reduce((a, b) => a + b)) : 0
}

const getFlightCostBusiness = (flights: FlightClientViewDto[]) => {
    return flights && flights.length > 0 ? Math.ceil(flights.map(x => x.businessCost).reduce((a, b) => a + b)) : 0
}

interface FlightInfoProps {
    flight: FlightClientViewDto;
    loading: boolean;
    selectedFavors?: Array<FlightFavorDto>;
    seat?: TicketDto | undefined | null;
    index?: number;
    onChange?: (favors: Array<FavorDto> | null, seat: TicketDto | undefined | null, flightId: string, index: number) => void;
    ticketType: "BUSINESS" | "ECONOMIC";
}

const FlightInfo = ({flight, loading}: FlightInfoProps) => {
    return (
        <Card key={flight.id} bordered={false} loading={loading} className="p-3">
            <Flex gap='small' className="position-relative" vertical>
                <Popover placement='bottom' className="position-absolute end-0" content={
                    <Flex vertical>{facts[flight.model]}
                    </Flex>
                } title={<p className="h3">Информация о самолете 🛩️</p>}>
                    <Button>{flight.model}</Button>
                </Popover>
                <Flex>
                    <Text className="text-truncate" style={{maxWidth: "25%"}}>{flight.departurePoint}</Text>
                    <Text>—</Text>
                    <Text className="text-truncate" style={{maxWidth: "25%"}}>{flight.destinationPoint}</Text>
                </Flex>
                <div className="">
                    <Text className='m-0 me-2 fw-bold'>Prometei Air</Text>
                    <Text type='secondary'>В
                        пути: {Math.floor(flight.flightTime / 60)}ч {flight.flightTime % 60}м</Text>
                </div>
                <Flex justify='space-between'>
                    <Flex vertical>
                        <span className='h5 mb-1'>{flight.departureTime}</span>
                        <Text type='secondary'>{flight.departureDate}</Text>
                    </Flex>
                    <Flex className='w-75' align='center' vertical>
                        <Divider className='rounded-2' style={{
                            borderBlockWidth: "4px",
                            borderBlockColor: "#1677ff"
                        }}/>
                    </Flex>
                    <Flex vertical align='flex-end'>
                        <span className='h5 mb-1'>{flight.destinationTime}</span>
                        <Text type='secondary'>{flight.destinationDate}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}

interface TicketFavor {
    ticket: TicketDto | null;
    favors: Array<FlightFavorDto>;
}

type TicketFavorRecord = Record<string, Array<TicketFavor>>

const FlightAdditionalFavorsInfo = ({flight, loading, onChange, ticketType, index}: FlightInfoProps) => {
    const [favors, setFavors] = useState<Array<FlightFavorDto>>([])
    const [selfLoading, setSelfLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const [ticket, setTicket] = useState<TicketFavor>({
        ticket: null,
        favors: []
    })

    useEffect(() => {
        onChange && index != null && onChange(ticket.favors, ticket.ticket, flight.id, index)
    }, [flight, ticket]);

    useEffect(() => {
        setSelfLoading(loading)
    }, [loading]);

    useEffect(() => {
        setSelfLoading(true)
        requests.getFlightFavors(flight.id)
            .then(req => {
                if (req instanceof Array) {
                    setFavors(req)
                    setSelfLoading(false)
                } else {
                    setError(true)
                    setSelfLoading(false)
                }
            })
    }, [flight]);

    const onChangeLocal = (favors: Array<FavorDto>, seat?: TicketDto | null | undefined) => {
        setTicket({
            ticket: seat ? seat : null,
            favors: favors,
        })
    }

    return (
        <Card bordered={false} loading={loading || selfLoading} className={"p-3" + (error ? " disabled" : "")}>
            {error && <Text type="secondary">Произошла ошибка при загрузке данных, приносим свои извинения</Text>}
            {!error && (
                <Flex vertical>
                    <Flex className='w-75'>
                        <Text className="text-truncate" style={{maxWidth: "25%"}}>{flight.departurePoint}</Text>
                        <Text>—</Text>
                        <Text className="text-truncate" style={{maxWidth: "25%"}}>{flight.destinationPoint}</Text>
                    </Flex>
                    <Text type='secondary'>
                        В пути: {Math.floor(flight.flightTime / 60)}ч {flight.flightTime % 60}м
                    </Text>
                    <FavorsSearch
                        ticketType={ticketType}
                        onChange={onChangeLocal}
                        flight={flight}
                        className="mt-2"
                        favors={favors}
                    />
                </Flex>
            )}
        </Card>
    )
}

const checkUser = (user: User) => {
    return !!user.email && !!user.firstName && !!user.lastName && (!!user.passport || (!!user.internationalPassportNum && !!user.internationalPassportDate))
}

const getDifference = (first: FlightClientViewDto, last: FlightClientViewDto, airports: Array<Airport>): number => {
    const timezone_first = +airports.find((airport: Airport) => airport.label === first.departurePoint)!.timezone
    const timezone_second = +airports.find((airport: Airport) => airport.label === last.destinationPoint)!.timezone

    const firstDate = dayjs(
        `${first.departureDate.split(",")[0]} 2024 ${first.departureTime}`,
        "D MMMM YYYY HH:mm",
        true
    ).unix() - timezone_first * 3600
    const lastDate = dayjs(
        `${last.destinationDate.split(",")[0]} 2024 ${last.destinationTime}`,
        "D MMMM YYYY HH:mm",
        true
    ).unix() - timezone_second * 3600

    return lastDate - firstDate
}

const PurchaseModal = ({search, open, onClose}: PurchaseModalProps) => {
    const {user} = useContext(UserContext)

    const [openModal, setOpenModal] = useState(open);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<number>(0);
    const [error, setError] = useState<boolean>(false)

    const [purchase, setPurchase] = useState<PurchaseCreateDto>();
    const [purchaseCost, setPurchaseCost] = useState<number>(0);

    const [tickets, setTickets] = useState<TicketFavorRecord>({});

    const [economyCost,] = useState<number>(
        search.flights.to.length && getFlightCostEconomy(search.flights.to) +
        (search.flights.back ? getFlightCostEconomy(search.flights.back) : 0)
    );
    const [businessCost,] = useState<number>(
        search.flights.to.length && getFlightCostBusiness(search.flights.to) +
        (search.flights.back ? getFlightCostBusiness(search.flights.back) : 0)
    )

    const [users, setUsers] = useState<Array<User | null>>(
        Array(search.params.countEconomic + search.params.countBusiness).fill(null)
    );

    const [flightToTime, setFlightToTime] = useState<number>(0)
    const [flightBackTime, setFlightBackTime] = useState<number>(0)

    useEffect(() => {
        user && setUsers(x => {
            x[0] = user;
            return [...x];
        });
    }, [user]);

    useEffect(() => {
        setLoading(true)
        flightApi.getAirports()
            .then(req => {
                if (req instanceof Array) {
                    setFlightToTime(getDifference(
                        search.flights.to[0],
                        search.flights.to[search.flights.to.length - 1],
                        req
                    ))
                    setFlightBackTime(search.flights.back ? getDifference(
                        search.flights.back[0],
                        search.flights.back[search.flights.to.length - 1],
                        req
                    ) : NaN)
                } else {
                    setError(true)
                }
                setLoading(false)
            })
        for (const flight of search.flights.to.concat(search.flights.back || [])) {
            setLoading(true)
            const arr: Array<TicketFavor> = []
            ticketApi.getByFlight(flight.id)
                .then(req => {
                    if (req instanceof Array) {
                        const ticketsRnd = req.filter(x => x.isEmpty);

                        let ecTickets = ticketsRnd.filter(x => x.ticketType === "ECONOMIC");
                        let bsTickets = ticketsRnd.filter(x => x.ticketType === "BUSINESS");

                        for (let i = 0; i < (search.params.countEconomic); i++) {
                            const tck = ecTickets[Math.floor(Math.random() * ecTickets.length)]
                            ecTickets = ecTickets.filter(x => x !== tck);
                            arr.push({
                                ticket: tck || null,
                                favors: []
                            })
                        }
                        for (let i = 0; i < (search.params.countBusiness); i++) {
                            const tck = bsTickets[Math.floor(Math.random() * bsTickets.length)]
                            bsTickets = bsTickets.filter(x => x !== tck);
                            arr.push({
                                ticket: tck || null,
                                favors: []
                            })
                        }
                        setTickets(x => {
                            x[flight.id] = arr;
                            return {...x}
                        })
                    }
                    setLoading(false)
                })
        }
    }, []);

    useEffect(() => {
        setOpenModal(open)
    }, [open]);

    useEffect(() => {
        if (step === 3) {
            const vals = Object.keys(tickets).flatMap(x => tickets[x])

            if (vals) {
                setLoading(true)
                Promise.all(vals.map(x => {
                    return x.ticket && ticketApi
                        .addAdditionalFavors(x.ticket.id, x.favors)
                        .then(req => {
                            if (typeof req === 'object') {
                                setError(true);
                            } else {
                                x.favors && x.favors.length > 0 && setPurchaseCost(prevState => {
                                    return prevState + x.favors.map(fav => fav.cost).reduce((a, b) => a + b);
                                })
                            }
                        })
                })).then(() => {
                    if (!users.some(x => x === null)) {
                        users && users.length > 0 && setPurchase({
                            paymentMethod: "SBP",
                            user: users[0]!,
                            passengers: users.filter(y => y !== users[0]!) as Array<User>,
                            tickets: vals.map(x => x!.ticket!.id),
                            isAuth: !!user
                        })
                    }
                    setLoading(false);
                })
            }
        }
    }, [step]);

    const onCloseModal = () => {
        onClose && onClose()
        setOpenModal(false)
    }

    const onChange = (favors: Array<FavorDto> | null | undefined,
                      seat: TicketDto | null | undefined,
                      flightId: string, index: number) => {
        favors && setTickets(x => {
            const oldVal = x[flightId][index]
            x[flightId][index] = {
                ticket: seat || oldVal.ticket,
                favors
            }
            return {...x}
        })
    }

    const onUserSubmit = (userL: User, index: number) => {
        userL && setUsers(x => {
            x[index] = userL;
            return [...x];
        });
    }

    return (
        <Modal
            centered
            width={"90vmin"}
            closeIcon={null}
            open={openModal}
            footer={
                <Flex gap='small' justify="end">
                    <Button onClick={() => onCloseModal()}>Закрыть</Button>
                    <Button loading={loading} disabled={step == 0 || step == 3}
                            onClick={() => setStep(x => x - 1)}>Назад</Button>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={() => setStep(x => x + 1)}
                        disabled={step === 1 ? users.some(x => !(x && checkUser(x))) : step == 3}
                    >Далее</Button>
                </Flex>
            }
            onCancel={() => onCloseModal()}
        >
            {error && (
                <Flex justify='center' align='center' gap='middle' vertical>
                    <WarningOutlined className="h1"/>
                    <Text className='h5'>Возникла непредвиденная ошибка</Text>
                    <Text type='secondary' className='h6'>Возникла непредвиденная ошибка</Text>
                </Flex>
            )}
            {step === 0 && (
                <Flex gap='middle' vertical>
                    <Card bordered={false} className="p-3">
                        <Flex vertical>
                            <p className='m-0 fs-5'>Эконом <b>{economyCost.toLocaleString()}</b> ₽
                                x <b>{search.params.countEconomic}</b> штук</p>
                            <p className='m-0 fs-5'>Бизнес <b>{businessCost.toLocaleString()}</b> ₽
                                x <b>{search.params.countBusiness}</b> штук</p>
                            <Text
                                type='secondary'>Итого: {(economyCost * search.params.countEconomic + businessCost * search.params.countBusiness).toLocaleString()} ₽</Text>
                        </Flex>
                    </Card>
                    <Divider plain>
                        <Text className="text-center h5 m-0">Туда</Text>
                    </Divider>
                    <Text className='text-center h6 m-0' type='secondary'>Общее время: {Math.floor(flightToTime / 3600)}ч {(flightToTime % 3600) / 60}м</Text>
                    {search.flights.to.map(flight => <FlightInfo ticketType={"ECONOMIC"} key={flight.id} flight={flight}
                                                                 loading={loading}/>)}
                    {search.flights.back && search.flights.back.length > 0 && (
                        <>
                            <Divider plain>
                                <Text className="text-center h5 m-0">Обратно</Text>
                            </Divider>
                            <Text className='text-center h6 m-0' type='secondary'>Общее время: {Math.floor(flightBackTime / 3600)}ч {(flightBackTime % 3600) / 60}м</Text>
                            {search.flights.back && search.flights.back.map(flight =>
                                <FlightInfo ticketType={"ECONOMIC"} key={flight.id} flight={flight} loading={loading}/>
                            )}
                        </>
                    )}
                </Flex>
            )}
            {step === 1 && (
                <Flex gap='small' justify='center' wrap>
                    {users.map((user, index) => <UserForm title={
                        index < search.params.countEconomic ? `Эконом #${index + 1}` : `Бизнес #${index - search.params.countBusiness + 1}`
                    } key={index} onSubmit={onUserSubmit} user={user as User} index={index}/>)}
                </Flex>
            )}
            {step === 2 && (
                <Tabs
                    type="card"
                    items={users.map((user, index) => {
                        const id = String(index)
                        return {
                            label: `${user?.firstName}`,
                            key: id,
                            forceRender: true,
                            children: (
                                <Flex className="" gap='small' vertical>
                                    {
                                        search.flights.to.map(flight => (
                                            <FlightAdditionalFavorsInfo
                                                onChange={onChange}
                                                index={index}
                                                key={flight.id}
                                                flight={flight}
                                                loading={loading}
                                                ticketType={index < search.params.countEconomic ? "ECONOMIC" : "BUSINESS"}
                                            />
                                        ))
                                    }
                                    {search.flights.back && search.flights.back.length > 0 && <Divider plain/> }
                                    {search.flights.back && search.flights.back.length > 0 && search.flights.back.map(flight => (
                                        <FlightAdditionalFavorsInfo
                                            onChange={onChange}
                                            index={index}
                                            key={flight.id}
                                            flight={flight}
                                            loading={loading}
                                            ticketType={index < search.params.countEconomic ? "ECONOMIC" : "BUSINESS"}
                                        />
                                    ))}
                                </Flex>
                            ),
                        }
                    })}
                />
            )}
            {step === 3 && loading && (
                <Flex justify='center' align='center' gap='middle' vertical>
                    <LoadingOutlined className="h1"/>
                    <Text className='h5'>Загружаем данные с сервера</Text>
                </Flex>
            )}
            {step === 3 && !loading &&
              <PaymentPage
                purchase={purchase}
                price={economyCost * search.params.countEconomic
                    + businessCost * search.params.countBusiness
                    + purchaseCost
                }
              />
            }
            <Divider plain>
                <Text className="text-center h5 m-0">Этап</Text>
            </Divider>
            <Steps
                size="small"
                current={step}
                items={[
                    {title: 'Просмотр билета'},
                    {title: 'Заполнение данных'},
                    {title: 'Выбор услуг'},
                    {title: 'Оплата'},
                ]}
            />
            <Divider/>
        </Modal>
    );
};

export default PurchaseModal;