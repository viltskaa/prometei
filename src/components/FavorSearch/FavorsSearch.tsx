import {FlightClientViewDto, FlightFavorDto, TicketDto} from "../../api/Types/types.ts";
import {Button, Card, Divider, Flex, Input, List, Tooltip, Typography} from "antd";
import {DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {BaseSyntheticEvent, useEffect, useState} from "react";
import SeatSelect from "../SeatSelect/SeatSelect.tsx";

const {Text} = Typography

interface FavorsSearchProps {
    className?: string
    favors: Array<FlightFavorDto>;
    onChange?: (favors: Array<FavorDto>, seat?: TicketDto | null | undefined) => void;
    loading?: boolean;
    flight: FlightClientViewDto
    selectedFavors?: Array<FlightFavorDto>;
    selectedSeat?: TicketDto | null;
    ticketType: "BUSINESS" | "ECONOMIC";
}

export interface FavorDto extends FlightFavorDto {
    disabled?: boolean;
}

const FavorsSearch = ({favors = [], onChange, loading, className, flight, selectedFavors, selectedSeat, ticketType}: FavorsSearchProps) => {
    const [data, setData] = useState<Array<FlightFavorDto>>(favors);
    const [filteredFavors, setFilteredFavors] = useState<Array<FlightFavorDto>>(data);
    const [selectedFavor, setSelectedFavor] = useState<Array<FlightFavorDto>>([]);
    const [filter, setFilter] = useState<string>("");

    const [seatSelectOpen, setSeatSelectOpen] = useState<boolean>(false);
    const [seat, setSeat] = useState<TicketDto | null>()

    useEffect(() => {
        selectedSeat && setSeat({...selectedSeat})
    }, [selectedSeat]);

    useEffect(() => {
        selectedFavors && setSelectedFavor(selectedFavors);
    }, [selectedFavors]);

    useEffect(() => {
        setData(favors)
    }, [favors]);

    useEffect(() => {
        setFilteredFavors(data.filter(
            y => y.name.toLowerCase().includes(filter.toLowerCase())
        ))
    }, [data, filter]);

    useEffect(() => {
        onChange && onChange(selectedFavor, seat)
    }, [selectedFavor, seat]);

    const onTyping = (event: BaseSyntheticEvent) => setFilter(event.target.value)

    const onAdd = (favor: FavorDto) => {
        if (!selectedFavor.some(x => x.id === favor.id)) {
            let newFavors = [...selectedFavor];

            if (favor.name.includes("места")) {
                setSeat(null)
                newFavors = newFavors.filter(fav => !fav.name.includes("места"))
            }

            setSelectedFavor([...newFavors, favor])
        } else {
            setSelectedFavor(selectedFavor.filter(x => x !== favor))
        }
    }

    const onClear = () => {
        setSeat(null)
        setSelectedFavor(() => []);
    }

    const onConfirmSelect = (ticket: TicketDto | null | undefined) => {
        ticket && setSeat({...ticket})
        setSeatSelectOpen(false)
    }

    return (
        <Flex gap='small' className={className || ""} vertical>
            <Flex gap='small' justify="end">
                <Input placeholder="Название услуги" disabled={loading} onChange={onTyping}/>
                <Tooltip title="Очистить выбор">
                    <Button onClick={() => onClear()} icon={<DeleteOutlined/>}/>
                </Tooltip>
            </Flex>
            <List
                loading={loading}
                size="small"
                bordered
                style={{
                    maxHeight: '145px',
                }}
                className="overflow-y-scroll px-3"
                dataSource={filteredFavors}
                renderItem={(item) => (
                    <List.Item key={item.id} className="disabled">
                        <Flex className='w-75' justify='space-between'>
                            <Tooltip title={item.name}>
                                <Text className='overflow-hidden' style={{maxWidth: "70%"}}>{item.name}</Text>
                            </Tooltip>
                            <Text>{item.cost.toLocaleString()} ₽</Text>
                        </Flex>
                        <Divider style={{backgroundColor: "var(--bs-primary)"}} type="vertical"/>
                        <Button
                            type={selectedFavor.find(x => x === item) !== undefined ? 'primary' : undefined}
                            onClick={() => onAdd(item)}
                            icon={!(selectedFavor.find(x => x === item) !== undefined) ? <PlusOutlined/> : <MinusOutlined/>}/>
                    </List.Item>
                )}
            />
            {selectedFavor.length > 0 && (
                <Card bordered={false}>
                    <Text className="text-center w-100">Стоимость услуг: <b>
                        {selectedFavor.length > 0 && selectedFavor.map(x => x.cost).reduce((a, b) => a + b).toLocaleString()} ₽
                    </b></Text>
                </Card>
            )}
            {selectedFavor.find(x => x.name === "Выбор места в салоне") && (
                <>
                    <Button onClick={() => setSeatSelectOpen(true)} type={seat ? "primary" : undefined}>
                        Выбрать место {seat && seat.seatNumber}
                    </Button>
                    <SeatSelect flight={flight}
                                selectedSeat={seat?.seatNumber}
                                onClose={() => setSeatSelectOpen(false)}
                                model={flight.model}
                                open={seatSelectOpen}
                                isBusiness={ticketType === "BUSINESS"}
                                seatType="any"
                                onSubmit={onConfirmSelect}/>
                </>
            )}
            {selectedFavor.find(x => x.name === "Выбор места у окна") && (
                <>
                    <Button onClick={() => setSeatSelectOpen(true)} type={seat ? "primary" : undefined}>
                        Выбрать место {seat && seat.seatNumber}
                    </Button>
                    <SeatSelect flight={flight}
                                selectedSeat={seat?.seatNumber}
                                onClose={() => setSeatSelectOpen(false)}
                                model={flight.model}
                                open={seatSelectOpen}
                                isBusiness={ticketType === "BUSINESS"}
                                seatType="window"
                                onSubmit={onConfirmSelect}/>
                </>
            )}
            {selectedFavor.find(x => x.name === "Выбор места с увеличенным пространством для ног") && (
                <>
                    <Button onClick={() => setSeatSelectOpen(true)} type={seat ? "primary" : undefined}>
                        Выбрать место {seat && seat.seatNumber}
                    </Button>
                    <SeatSelect flight={flight}
                                selectedSeat={seat?.seatNumber}
                                onClose={() => setSeatSelectOpen(false)}
                                model={flight.model}
                                open={seatSelectOpen}
                                isBusiness={ticketType === "BUSINESS"}
                                seatType="foot"
                                onSubmit={onConfirmSelect}/>
                </>
            )}
        </Flex>
    );
};

export default FavorsSearch;