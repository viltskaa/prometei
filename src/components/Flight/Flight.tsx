import {Card, Flex, Divider, Timeline, Button, Popover, Typography, Tag, Tooltip} from "antd";
import {ClockCircleOutlined, GithubOutlined} from '@ant-design/icons';
import "./Flight.css"
import {FlightClientViewDto} from "../../api/Types/types.ts";
import {useState} from "react";

const {Text} = Typography

export interface FlightProps {
    flight: Array<FlightClientViewDto>;
    flightBack: Array<FlightClientViewDto>;
    compact?: boolean;
    loading?: boolean;
    onSelect?: (flight: Array<FlightClientViewDto>, flightBack: Array<FlightClientViewDto>) => void;
    withPet?: boolean;
}

const FlightInfo = ({flight}: { flight: FlightClientViewDto }) => {
    return (
        <Flex justify='space-between'>
            <Flex style={{minWidth: "150px"}} vertical>
                <span className='h5 mb-1'>{flight.departureTime}</span>
                <Text type='secondary'>{flight.departureDate}</Text>
                <Tooltip title={flight.departurePoint}>
                    <Text type='secondary'
                          className='text-truncate'
                          style={{maxWidth: "150px"}}
                    >{flight.departurePoint}</Text>
                </Tooltip>
            </Flex>
            <Flex className='w-100 mx-3' align='center' vertical>
                <Flex className='w-100 justify-content-center justify-content-lg-between' justify='space-between'>
                    <span className='d-none d-lg-block'>Взлет</span>
                    <span
                        className='text-secondary'>В пути: {Math.floor(flight.flightTime / 60)}ч {flight.flightTime % 60}м</span>
                    <span  className='d-none d-lg-block'>Посадка</span>
                </Flex>
                <Divider className='rounded-2' style={{
                    borderBlockWidth: "4px",
                    borderBlockColor: "#1677ff"
                }}/>
            </Flex>
            <Flex style={{minWidth: "150px"}} vertical align='flex-end'>
                <span className='h5 mb-1'>{flight.destinationTime}</span>
                <Text type='secondary'>{flight.destinationDate}</Text>
                <Tooltip title={flight.destinationPoint}>
                    <Text type='secondary'
                          className='text-truncate'
                          style={{maxWidth: "150px"}}
                    >{flight.destinationPoint}</Text>
                </Tooltip>
            </Flex>
        </Flex>
    )
}

const FlightSmInfo = ({flight}: { flight: FlightClientViewDto }) => {
    return (
        <Flex className='w-100' justify='space-between' gap='small' align='center'>
            <Flex className='ms-1' vertical>
                <span className='text-truncate mb-1'>{flight.departureDate} {flight.departureTime}</span>
                <Text type='secondary'>{flight.departurePoint.split(',')[2]}</Text>
            </Flex>
            <Flex className='w-100' align='center' vertical>
                <Divider className='rounded-2 mt-2 mb-3' style={{
                    width: '50px',
                    borderBlockWidth: "2px",
                    borderBlockColor: "#1677ff"
                }}/>
                <span className='text-secondary'>{Math.floor(flight.flightTime / 60)}ч {flight.flightTime % 60}м</span>
            </Flex>
            <Flex className='ms-1' vertical>
                <span className='text-truncate mb-1'>{flight.destinationDate} {flight.destinationTime}</span>
                <Text type='secondary' className='text-end'>{flight.destinationPoint.split(',')[2]}</Text>
            </Flex>
        </Flex>
    )
}

const FlightTimeLine = ({flight, title}: { flight: FlightClientViewDto, title?: string }) => {
    return (
        <Card className='w-100' title={title || ""}>
            <Flex vertical justify='center' align='center' className='w-100'>
                <Timeline className='w-100 h-100 mt-4' mode='right' items={[
                    {
                        label: <span>{flight.departureTime} {flight.departureDate}</span>,
                        children: flight.departurePoint,
                    },
                    {
                        dot: <ClockCircleOutlined style={{fontSize: '16px'}}/>,
                        color: 'blue',
                        children: (<span className="fw-bold">В пути</span>),
                        label: (
                            <span>{Math.floor(flight.flightTime / 60)}ч {flight.flightTime % 60}м</span>)
                    },
                    {
                        label: <span>{flight.destinationTime} {flight.destinationDate}</span>,
                        children: flight.destinationPoint,
                    }
                ]}/>
            </Flex>
        </Card>
    )
}

const getFlightCostEconomy = (flights: FlightClientViewDto[]) => {
    return flights && flights.length > 0 ? Math.ceil(flights.map(x => x.economyCost).reduce((a, b) => a + b)) : 0
}

const getFlightCostBusiness = (flights: FlightClientViewDto[]) => {
    return flights && flights.length > 0 ? Math.ceil(flights.map(x => x.businessCost).reduce((a, b) => a + b)) : 0
}

const Flight = ({flight, flightBack, compact, loading, onSelect, withPet}: FlightProps) => {
    const [economyCost,] = useState<number>(
        flight.length && getFlightCostEconomy(flight) +
        (flightBack ? getFlightCostEconomy(flightBack) : 0)
    );
    const [businessCost,] = useState<number>(
        flight.length && getFlightCostBusiness(flight) +
        (flightBack ? getFlightCostBusiness(flightBack) : 0)
    )

    const onClick = () => {
        onSelect && onSelect(flight, flightBack)
    }

    return (
        <Card className="p-3" loading={loading}>
            <Flex gap='middle' className='d-none d-md-flex'>
                <Flex vertical gap='small' justify={"start"}
                      className="w-25 position-relative">
                    {withPet && (
                        <Tooltip title="Можно с животными">
                            <GithubOutlined className='position-absolute end-0 fs-3'/>
                        </Tooltip>
                    )}
                    <p className='h6 m-0 fw-bold'>Эконом: {economyCost.toLocaleString()} ₽</p>
                    <p className='h6 m-0 fw-bold'>Бизнес: {businessCost.toLocaleString()} ₽</p>
                    {!compact && (
                        <>
                            {flight[0].flightFavorDtos.map(x => (
                                <Popover key={x.id} title={`${x.name}, ${x.cost.toLocaleString()} ₽`}>
                                    <Card className='p-1 px-2'>
                                        <Flex justify='space-between' align='center'>
                                            <span className='me-2 text-truncate' style={{
                                                maxWidth: "60%"
                                            }}>{x.name}</span>
                                            <Text type='success' className='me-2'>{x.cost.toLocaleString()} ₽</Text>
                                        </Flex>
                                    </Card>
                                </Popover>
                            ))}
                        </>
                    )}
                    <Button onClick={onClick} type='primary'>Выбрать</Button>
                </Flex>
                {
                    compact
                        ? (
                            <>
                                {flight.map(flght => <FlightTimeLine key={flght.id} flight={flght} title='Туда'/>)}
                                {flightBack && flightBack.map(flght => <FlightTimeLine key={flght.id} flight={flght}
                                                                                       title='Туда'/>)}
                            </>
                        )
                        : (
                            <>
                                <Card className='w-100 p-3' classNames={{
                                    body: "h-100"
                                }}>
                                    <Flex justify="center" className='h-100' vertical>
                                        {flight.map(flght => <FlightInfo key={flght.id} flight={flght}/>)}
                                        {flightBack && <Divider plain/>}
                                        {flightBack && flightBack.map(flght => <FlightInfo key={flght.id} flight={flght}/>)}
                                    </Flex>
                                </Card>
                            </>
                        )
                }
            </Flex>
            <Flex onClick={onClick} className='flex flex-wrap d-md-none position-relative' gap='small' vertical>
                {withPet && (
                    <Tooltip title="Можно с животными">
                        <GithubOutlined className='position-absolute end-0 fs-3'/>
                    </Tooltip>
                )}
                <p className='h6 m-0'>Эконом: {economyCost.toLocaleString()} ₽</p>
                <p className='h6 m-0'>Бизнес: {businessCost.toLocaleString()} ₽</p>
                {flight[0].flightFavorDtos.map(x => (
                    <Popover key={x.id} title={`${x.name}, ${x.cost.toLocaleString()} ₽`}
                             className='w-100 flex-fill m-0'>
                        <Tag className='p-1 px-2 rounded-2 w-100' style={{
                            borderColor: 'var(--bs-primary)'
                        }}>
                            <Flex justify='space-between' align='center'>
                                            <Text className='me-2 text-truncate' style={{
                                                maxWidth: "60%"
                                            }}>{x.name}</Text>
                                <Text className='me-2'>+{x.cost.toLocaleString()} ₽</Text>
                            </Flex>
                        </Tag>
                    </Popover>
                ))}
                <Flex className='h-100' vertical>
                    {flight.map(flght => <FlightSmInfo key={flght.id} flight={flght}/>)}
                    {flightBack && <Divider/>}
                    {flightBack && flightBack.map(flght => <FlightSmInfo key={flght.id} flight={flght}/>)}
                </Flex>
            </Flex>
        </Card>
    )
};

export default Flight;