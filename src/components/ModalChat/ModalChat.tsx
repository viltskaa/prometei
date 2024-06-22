import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Divider, Flex, Form, FormProps, Modal, Select, Spin, Tooltip, Typography} from "antd";
import {LoadingOutlined, DeleteOutlined, SendOutlined} from '@ant-design/icons';

import TypingText from "../TypingText/TypingText.tsx";
import {MessageDto, PlaceDto} from "../../api/Types/types.ts";
import TextArea from "antd/es/input/TextArea";
import requests from "../../api/Requests/ChatApi.ts";
import {UserContext} from "../../main.tsx";
import FlightPreviewModal from "../FlightPreviewModal/FlightPreviewModal.tsx";

const {Text} = Typography

export interface ModalChatProps {
    visible?: boolean;
    onClose?: () => void;
}

export interface Message {
    author: "USER" | "LSTM" | "GRU" | "CNN" | "GigaChad" | "BOT";
    message: string;
    content?: Array<PlaceDto>;
    loading?: boolean
}

const nameConvert = {
    USER: "Вы",
    LSTM: "Андрей",
    GRU: "Максим",
    CNN: "Аня",
    BOT: "Бот",
    GigaChad: "ГигаЧад"
}

interface ChatMessageProps {
    msg: Message
    onContentClick: (place: PlaceDto) => void;
}

const ChatMessage = ({msg, onContentClick}: ChatMessageProps) => {
    return (
        <>
            <Flex
                justify={msg.author !== 'USER' ? 'left' : 'right'}
                gap='small'
                align='start'
                className={'m-0'}
            >
                <Text type='secondary' className='mt-2'>{nameConvert[msg.author]}:</Text>
                <Card
                    className={'p-2 ' + (msg.author === 'USER' ? " text-white" : "")}
                    style={{backgroundColor: msg.author === 'USER' ? "#1668dc" : "", maxWidth: '75%'}}
                >
                    <Flex className='w-100'>
                        {msg.loading && (
                            <Spin className='me-2' indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                        )}
                        {msg.author !== 'USER' ?
                            (<TypingText text={msg.message}/>) :
                            (<span style={{display: 'inline', whiteSpace: "wrap"}}>{msg.message}</span>)}
                    </Flex>
                </Card>
            </Flex>
            {msg.content && (
                <Flex vertical gap='small' align='start'>
                    {msg.content.map((item, i) => (
                        <Card className='p-3' key={i} onClick={() => onContentClick(item)} hoverable>
                            <Flex className='w-100' vertical>
                                <b><TypingText text={`Место: ${item.namePlace}`}/></b>
                                <TypingText text={`Адрес: ${item.address}`}/>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            )}
        </>
    )
}

const defaultBotMessage: Message = {
    author: "BOT",
    message: "Здравствуйте, опишите мне место, куда хотели бы поехать!"
}

const options = [
    {value: 'LSTM', label: 'Андрей'},
    {value: 'GRU', label: 'Максим'},
    {value: 'CNN', label: 'Аня'},
    {value: 'GigaChad', label: 'ГигаЧад'},
]


const ModalChat = ({visible, onClose}: ModalChatProps): React.ReactElement => {
    const {user} = useContext(UserContext);

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<Array<Message>>([defaultBotMessage])
    const [form] = Form.useForm<MessageDto>();

    const [place, setPlace] = useState<PlaceDto | null>(null);

    const onCancel = () => {
        setVisibleModal(x => !x);
        setPlace(null)
        onClose && onClose();
    }

    const clearChatHistory = () => {
        setChatHistory(() => [{...defaultBotMessage}])
        setDisabled(false);
    }

    useEffect(() => {
        if (typeof visible !== 'undefined')
            setVisibleModal(visible);
    }, [visible])

    const onFinish: FormProps<MessageDto>['onFinish'] = (values) => {
        if (values.question.length > 0) {
            setChatHistory(hst => [...hst, {message: values.question, author: "USER"}]);
            form.setFieldValue("question", "")
            setDisabled(true);
            const lastMessage: Message = {
                message: "Ждем ответ от сервера",
                author: values.modelType,
                loading: true
            }
            setChatHistory(hst => [...hst, lastMessage]);
            requests.getAnswer({
                modelType: values.modelType,
                moodType: "Positive",
                email: user?.email ?? "example@example.com",
                question: values.question
            }).then(req => {
                const newMessage = {
                    author: values.modelType,
                    message: typeof req == 'string'
                        ? req != "Not Found" && req != "Ошибка в запросе к нейронной сети"
                            ? values.modelType !== 'GigaChad' ? `Определенная тематика: ${req}` : req
                            : "Извините, я вас не понял, повторите ваш запрос"
                        : "Внутреняя ошибка сервера. Попробуйте позже",
                }
                setChatHistory(hst => {
                    hst.pop()
                    return [...hst, newMessage];
                })
                if (typeof req === 'string' && req != "Not Found" && req != "Ошибка в запросе к нейронной сети" && values.modelType !== 'GigaChad') {
                    requests.getPlace({
                        mood: "Positive",
                        rubric: req,
                    }).then(placeReq => {
                        if (placeReq instanceof Array) {
                            const newMessagePlace = {
                                author: values.modelType,
                                message: "Вот места, которые мы можем вам предложить!",
                                content: placeReq,
                            }
                            setChatHistory(hst => {
                                return [...hst, newMessagePlace];
                            })
                        }
                    })
                }
                setDisabled(false)
            })
        }
    };

    return (
        <>
            <Modal
                open={visibleModal && visibleModal}
                onCancel={onCancel}
                footer={null}
                width="90vmin"
            >
                <Flex vertical style={{
                    height: "75vh",
                }}>
                    <p className='h2 text-center'>Ваш гид по путешествиям</p>
                    <Divider/>
                    <Flex className='h-100 overflow-y-scroll p-3' vertical gap='small'>
                        {chatHistory.map((msg, index) => <ChatMessage
                            key={index}
                            msg={msg}
                            onContentClick={(place) => setPlace(place)}
                        />)}
                    </Flex>
                    <Divider/>
                    <Form
                        form={form}
                        disabled={disabled}
                        onFinish={onFinish}
                        initialValues={{
                            modelType: "LSTM"
                        }}
                        autoComplete="off"
                    >
                        <Flex className='w-100 flex-wrap' gap='small'>
                            <Flex gap='small' className='w-100 flex-fill'>
                                <Form.Item<MessageDto>
                                    className='m-0 w-100'
                                    name="question"
                                >
                                    <TextArea placeholder="Ваше сообщение" rows={1}/>
                                </Form.Item>
                                <Form.Item<MessageDto> className='m-0'>
                                    <Tooltip title="Отправить сообщение">
                                        <Button type="primary" htmlType="submit" icon={<SendOutlined/>}/>
                                    </Tooltip>
                                </Form.Item>
                            </Flex>
                            <Form.Item<MessageDto>
                                name='modelType'
                                className='m-0 w-25 flex-fill'
                            >
                                <Select
                                    className='w-100'
                                    options={options}
                                    suffixIcon={<p className='m-0'>Ваш собеседник</p>}
                                />
                            </Form.Item>
                            <Tooltip title="Обновить чат">
                                <Button
                                    disabled={false}
                                    onClick={() => clearChatHistory()}
                                    type='dashed'
                                    icon={<DeleteOutlined/>}
                                />
                            </Tooltip>
                        </Flex>
                    </Form>
                </Flex>
            </Modal>
            {place && <FlightPreviewModal
              visible={!!place}
              place={place}
              onClose={() => {
                  setPlace(null)
              }}
              onForceClose={() => {
                  onCancel()
              }}
            />}
        </>
    );
};

export default ModalChat;