import {AirplaneModel, FlightClientViewDto, HeatMapDto, TicketDto} from "../../api/Types/types.ts";
import {Button, Card, Flex, Modal, Pagination, Switch, Typography} from "antd";
import {useContext, useEffect, useState} from "react";
import requests from "../../api/Requests/TicketApi.ts";
import {default as statistic} from "../../api/Requests/StatisticApi.ts";

import "./SeatSelect.css"
import {UserContext} from "../../main.tsx";

const {Text} = Typography;

interface SeatSelectProps {
    flight: FlightClientViewDto;
    model: AirplaneModel;
    seatType: "any" | "foot" | "window";
    isBusiness?: boolean;
    open: boolean;
    onSubmit: (value: TicketDto | null | undefined) => void;
    selectedSeat?: string;
    onClose?: () => void
}

interface AirplaneProps {
    isBusiness?: boolean;
    tickets: Array<TicketDto>;
    selectedOption: "any" | "foot" | "window";
    selectedSeat?: string;
    onSubmit: (value: string) => void;
    loading?: boolean;
    heatMap?: HeatMapDto | null;
}

interface SeatProps {
    name: string;
    ticketType: "BUSINESS" | "ECONOMIC";
    onClick?: (name: string) => void;
    disabled?: boolean;
    seatType: "any" | "foot" | "window";
    selectedOption: "any" | "foot" | "window";
    selectedSeat?: string;
    width?: string;
    loading?: boolean;
    heatMap?: number | null | undefined;
}

interface GenerateSeatProps {
    onClick?: (name: string) => void,
    from: number,
    to: number,
    prefix: string,
    type: "BUSINESS" | "ECONOMIC",
    seats: Array<TicketDto>,
    seatType?: "any" | "foot" | "window",
    selectedOption: "any" | "foot" | "window",
    selectedSeat?: string;
    width?: string;
    loading?: boolean;
    heatMap?: HeatMapDto | null;
}

const Seat = ({
                  name,
                  onClick,
                  ticketType,
                  disabled,
                  seatType,
                  selectedOption,
                  selectedSeat,
                  width,
                  loading,
                  heatMap
              }: SeatProps) => {
    const [color, setColor] = useState<string>("unset");

    useEffect(() => {
        if (heatMap) {
            setColor(`#1668dc${(Math.floor(heatMap * 256 * 100)).toString(16)}`)
        }
    }, [heatMap, name]);

    return (
        <Button loading={loading}
                disabled={disabled || (ticketType !== "BUSINESS" && (selectedOption != seatType))}
                className={'flex-fill '
                    + (seatType == "foot" ? "border border-primary" : "")
                    + (seatType == "window" ? "border border-success" : "")
                    + (selectedSeat == name ? " text-success fw-bolder" : "")
                }
                onClick={() => onClick && onClick(name)}
                size="small"
                style={{
                    background: heatMap ? color : "",
                    width: !width ? ticketType && ticketType == "BUSINESS" ? "79px" : "50px" : width
                }}
        >
            <Flex justify='center' align='center'>
                {!loading && name}
            </Flex>
        </Button>
    )
}

const FakeSeat = ({ticketType, width}: { ticketType: "BUSINESS" | "ECONOMIC", width: string }) => {
    return (
        <Button disabled={true}
                className={'flex-fill'}
                size="small"
                style={{
                    width: !width ? ticketType && ticketType == "BUSINESS" ? "79px" : "50px" : width,
                }}
        />
    )
}

const GenerateSeat = ({
                          onClick,
                          from,
                          to,
                          prefix,
                          type,
                          seats,
                          seatType = "any",
                          selectedSeat,
                          selectedOption,
                          width,
                          loading,
                          heatMap
                      }: GenerateSeatProps) => {
    return (
        Array.from(Array(to - from + 1).keys()).map(x => {
            const ticket = seats.find(y => y.seatNumber == `${from + x}${prefix}`);
            const value = heatMap && heatMap.seats.find(y => y[`${from + x}${prefix}`])
            return (<Seat
                heatMap={value ? value[`${from + x}${prefix}`] : undefined}
                loading={loading}
                width={width}
                selectedSeat={selectedSeat}
                selectedOption={selectedOption}
                seatType={(from + x != 10 || seatType == "window") ? seatType : "foot"}
                disabled={ticket && !ticket.isEmpty}
                onClick={onClick}
                key={`${from + x}${prefix}`}
                name={`${from + x}${prefix}`}
                ticketType={type}
            />)
        })
    )
}

const Airbus330 = ({isBusiness, tickets, selectedOption, selectedSeat, onSubmit, loading, heatMap}: AirplaneProps) => {
    const [page, setPage] = useState<number>(1);
    const busWidth = '40px'
    const ecoWidth = '38px'

    const onChange = (page: number) => setPage(page)

    return (
        <Flex justify='center' align='center' gap='small' vertical>
            {isBusiness && (
                <Flex className="seats" gap='small'>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'A'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'C'}/>
                        </Flex>
                    </Flex>
                    <Card bordered={false} className='p-2 p-sm-3'/>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'D'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'G'}/>
                        </Flex>
                    </Flex>
                    <Card bordered={false} className='p-2 p-sm-3'/>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'H'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          width={busWidth}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={6} prefix={'K'}/>
                        </Flex>
                    </Flex>
                </Flex>
            )}
            {!isBusiness && (
                <Flex gap='small' justify='center' align='center' vertical>
                    {page == 1 && (
                        <Flex className="seats" gap='small' justify='center' align='center' vertical>
                            <Flex gap={4}>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"window"} seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={27}
                                                      prefix={'A'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={27}
                                                      prefix={'C'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "280px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"any"} seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={28}
                                                      prefix={'D'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={28}
                                                      prefix={'E'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={28}
                                                      prefix={'F'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={28}
                                                      prefix={'G'}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={11} to={27}
                                                      prefix={'H'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      seatType={"window"}
                                                      type={"ECONOMIC"} from={11} to={27}
                                                      prefix={'K'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    )}
                    {page == 2 && (
                        <Flex className="seats" gap='small' justify='center' align='center' vertical>
                            <Flex gap={4}>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"window"} seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'A'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'C'}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "280px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"any"} seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'D'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'E'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'F'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'G'}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'H'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      seatType={"window"}
                                                      type={"ECONOMIC"} from={29} to={40}
                                                      prefix={'K'}/>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex gap={4}>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"window"} seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={44}
                                                      prefix={'A'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={44}
                                                      prefix={'C'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "280px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seatType={"any"} seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={45}
                                                      prefix={'D'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={45}
                                                      prefix={'E'}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={45}
                                                      prefix={'G'}/>
                                    </Flex>
                                </Flex>
                                <Card bordered={false} className='p-1 p-sm-2'/>
                                <Flex gap={4} style={{maxWidth: "166px"}} wrap>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={43}
                                                      prefix={'H'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                    <Flex vertical gap={4}>
                                        <GenerateSeat selectedSeat={selectedSeat}
                                                      heatMap={heatMap}
                                                      loading={loading}
                                                      width={ecoWidth}
                                                      onClick={onSubmit}
                                                      selectedOption={selectedOption}
                                                      seats={tickets}
                                                      type={"ECONOMIC"} from={41} to={43}
                                                      seatType={"window"}
                                                      prefix={'K'}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                        <FakeSeat ticketType={"ECONOMIC"} width={ecoWidth}/>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    )}
                    <Pagination defaultCurrent={1} total={20} onChange={onChange}/>
                </Flex>
            )}
        </Flex>
    )
}

const Airbus320 = ({isBusiness, tickets, selectedOption, selectedSeat, onSubmit, loading, heatMap}: AirplaneProps) => {
    return (
        <Flex justify='center' align='center' gap='small' vertical>
            {isBusiness && (
                <Flex gap='small'>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={5} prefix={'A'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={5} prefix={'C'}/>
                        </Flex>
                    </Flex>
                    <Card bordered={false} className='p-2 p-sm-3'/>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={5} prefix={'D'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"BUSINESS"} from={1}
                                          to={5} prefix={'F'}/>
                        </Flex>
                    </Flex>
                </Flex>
            )}
            {!isBusiness && (
                <Flex gap='small'>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seatType={"window"} seats={tickets}
                                          type={"ECONOMIC"} from={6} to={25}
                                          prefix={'A'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"ECONOMIC"} from={6}
                                          to={25} prefix={'B'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"ECONOMIC"} from={6}
                                          to={25} prefix={'C'}/>
                        </Flex>
                    </Flex>
                    <Card bordered={false} className='p-2 p-sm-3'/>
                    <Flex gap='small' style={{maxWidth: "166px"}} wrap>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"ECONOMIC"} from={6}
                                          to={25} prefix={'D'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seats={tickets}
                                          type={"ECONOMIC"} from={6}
                                          to={25} prefix={'E'}/>
                        </Flex>
                        <Flex vertical gap='small'>
                            <GenerateSeat selectedSeat={selectedSeat}
                                          heatMap={heatMap}
                                          loading={loading}
                                          onClick={onSubmit}
                                          selectedOption={selectedOption}
                                          seatType={"window"} seats={tickets}
                                          type={"ECONOMIC"} from={6} to={25}
                                          prefix={'F'}/>
                        </Flex>
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}

const SeatSelect = ({flight, model, seatType, isBusiness, open, onSubmit, selectedSeat, onClose}: SeatSelectProps) => {
    const {user} = useContext(UserContext);

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [tickets, setTickets] = useState<Array<TicketDto>>([]);
    const [heatMap, setHeatMap] = useState<boolean>(false);
    const [heatMapLoading, setHeatMapLoading] = useState<boolean>(false);
    const [heatMapValue, setHeatMapValue] = useState<Array<HeatMapDto> | null>(null);

    useEffect(() => {
        setOpenModal(open)
    }, [open]);

    useEffect(() => {
        setHeatMapLoading(true);
        requests.getByFlight(flight.id)
            .then(req => {
                if (req instanceof Array) {
                    setTickets(req)
                }
                setHeatMapLoading(false)
            })
    }, [flight]);

    useEffect(() => {
        if (heatMap) {
            setHeatMapLoading(true);
            user && user.id && statistic.heatMap(user.id, model)
                .then(req => {
                    if (req instanceof Array) {
                        setHeatMapValue(req)
                    }
                    setHeatMapLoading(false)
                })
        }
    }, [heatMap, user]);

    const onClick = (name: string) => onSubmit && onSubmit(
        tickets && tickets.find(ticket => ticket.seatNumber === name)
    )

    const close = () => {
        onClose && onClose()
        setOpenModal(false)
    }

    const heatMapChange = () => setHeatMap(x => !x)

    return (
        <Modal
            title={<p className="h4 m-0 text-center mb-3">Выбор места в салоне</p>}
            centered
            closeIcon={null}
            open={openModal}
            footer={
                <Flex className="w-100" justify='center'>
                    <Button onClick={() => close()} className="w-75">Закрыть</Button>
                </Flex>
            }
        >
            <Flex justify='center' align='center' gap='small' className="mb-2" vertical>
                <Flex align='center' gap="small" className="flex-fill">
                    <Button size="small" className="border border-primary">A1</Button>
                    <Text>Увеличенное место для ног</Text>
                </Flex>
                <Flex align='center' gap="small" className="flex-fill">
                    <Button size="small" className="border border-success">A1</Button>
                    <Text>Место у иллюминатора</Text>
                </Flex>
                {user && (
                    <Flex gap='small'>
                        Включить теловую карту
                        <Switch loading={heatMapLoading} onChange={() => heatMapChange()}/>
                    </Flex>
                )}
            </Flex>
            {model == "AIRBUS320" &&
              <Airbus320
                heatMap={heatMap && heatMapValue ? heatMapValue.find(x => x.airplane === "AIRBUS320") : undefined}
                loading={heatMapLoading}
                onSubmit={onClick}
                selectedSeat={selectedSeat}
                selectedOption={seatType}
                tickets={tickets}
                isBusiness={isBusiness}
              />
            }
            {model == "AIRBUS330" &&
              <Airbus330
                heatMap={heatMap && heatMapValue ? heatMapValue.find(x => x.airplane === "AIRBUS330") : undefined}
                loading={heatMapLoading}
                onSubmit={onClick}
                selectedSeat={selectedSeat}
                selectedOption={seatType}
                tickets={tickets}
                isBusiness={isBusiness}
              />
            }
        </Modal>
    );
};

export default SeatSelect;