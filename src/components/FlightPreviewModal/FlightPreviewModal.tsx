import {useContext, useEffect, useState} from 'react';
import {Button, Card, Divider, Flex, Modal, Typography} from "antd";

import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import geoDecode from "../../api/Requests/YandexApi.ts";
import {useNavigate} from "react-router-dom";
import {PlaceDto} from "../../api/Types/types.ts";
import {UserContext} from "../../main.tsx";

const {Text} = Typography;

interface FlightPreviewModalProps {
    visible: boolean;
    place: PlaceDto;
    onClose?: () => void;
    onForceClose?: () => void;
}

const FlightPreviewModal = ({visible, place, onClose, onForceClose}: FlightPreviewModalProps) => {
    const navigate = useNavigate();
    const {setNotification} = useContext(UserContext);

    const [visibleModal, setVisibleModal] = useState<boolean>(visible);
    const [coords, setCoords] = useState<[number, number] | null>();
    const [loading, setLoading] = useState<boolean>(false);

    const onCancel = () => {
        setVisibleModal(false);
        setCoords(null)
        onClose && onClose();
    }

    useEffect(() => {
        setLoading(true)
        visible && geoDecode({
            apikey: import.meta.env.VITE_YANDEX_MAPS_API as string,
            geocode: place.address,
            lang: 'ru_RU',
            format: 'json',
            results: 5,
        }).then(req => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const value = req.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos as string
            const [d, s] = value.split(" ").map(x => +x)
            console.log(s, d)
            setCoords([s, d])
            setLoading(false)
        })
    }, [place, visible]);

    useEffect(() => {
        setVisibleModal(visible)
    }, [visible]);

    const onConfirm = () => {
        console.log(place.airport)
        onForceClose && onForceClose()
        setNotification(<Text className='h5 m-0 text-white'>{place.airport}</Text>)
        navigate("/", {
            state: {
                destinationPoint: place.airport
            },
        })
    }

    return (
        <YMaps query={{
            apikey: import.meta.env.VITE_YANDEX_MAPS_API
        }}>
            <Modal
                centered
                open={visibleModal}
                closeIcon={null}
                onCancel={onCancel}
                footer={null}
                style={{
                    maxWidth: '90wv'
                }}
            >
                <Flex align='center' vertical>
                    <Text className='h3 mb-0'>{place.namePlace}</Text>
                    <Text className='text-center' type='secondary'>{place.address}</Text>
                    <Text className='text-center' type='secondary'>{place.airport}</Text>
                    <Divider/>
                    {coords && (
                        <Map width={"100%"} defaultState={{ center: coords, zoom: 15 }}>
                            <Placemark geometry={coords} />
                        </Map>
                    )}
                    {!coords && (
                        <Card loading={loading}/>
                    )}
                    <Divider/>
                    <Button className='w-100 text-truncate' type='primary' loading={loading} onClick={onConfirm}>
                        Проложить маршрут
                    </Button>
                </Flex>
            </Modal>
        </YMaps>
    );
};

export default FlightPreviewModal;