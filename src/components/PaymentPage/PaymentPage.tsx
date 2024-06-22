import {Button, Card, Flex, Form, Input, QRCode, Select, Typography} from "antd";
import {PaymentMethod, PurchaseCreateDto} from "../../api/Types/types.ts";
import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import requests from "../../api/Requests/PaymentApi.ts";
import {LoadingOutlined, WarningOutlined, CheckOutlined} from "@ant-design/icons";
import purchaseApi from "../../api/Requests/PurchaseApi.ts";
import request from "../../api/Requests/EmailApi.ts";

interface PaymentPageProps {
    price: number,
    purchase?: PurchaseCreateDto | null
}

interface Card {
    number: string;
    month: string;
    year: string;
    cvv: string;
}

const {Text} = Typography;

const BankCard = ({onEnter}: { onEnter: () => void }) => {
    const [form] = useForm<Card>()

    const onValueChange = (_val: unknown, values: Card) => {
        if (values.number && values.number.length == 16
            && values.cvv && values.cvv.length == 3
            && values.month && values.month.length == 2
            && values.year && values.year.length == 2) {
            onEnter && onEnter();
        }
    }

    return (
        <Card bordered className='p-3'>
            <Flex justify='center' align='center'>
                <Form form={form} layout='vertical' onValuesChange={onValueChange}>
                    <Form.Item<Card>
                        name='number'
                        label="Номер карты"
                        rules={[
                            {required: true},
                        ]}
                        className="">
                        <Input.OTP length={16}/>
                    </Form.Item>

                    <Flex gap='small' className="">
                        <Form.Item<Card>
                            label="Месяц"
                            name='month'
                            className='w-25'
                            rules={[
                                {required: true, message: ""}
                            ]}
                        >
                            <Input maxLength={2}/>
                        </Form.Item>

                        <Form.Item<Card>
                            label="Год"
                            name='year'
                            className='w-25'
                            rules={[
                                {required: true, message: ""}
                            ]}
                        >
                            <Input maxLength={2}/>
                        </Form.Item>
                    </Flex>
                    <Form.Item<Card>
                        label="CVV"
                        name='cvv'
                        className="w-25"
                        rules={[
                            {required: true, message: ""}
                        ]}
                    >
                        <Input maxLength={3}/>
                    </Form.Item>
                </Form>
            </Flex>
        </Card>
    )
}

const PaymentPage = ({price, purchase}: PaymentPageProps) => {
    const [hash, setHash] = useState<string>("")

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("SBP")
    const [payNext, setPayNext] = useState<boolean>(false)
    const [cardValid, setCardValid] = useState<boolean>(false)

    const [countdown, setCountdown] = useState(180);

    const [loading, setLoading] = useState<boolean>(false)
    const [paymentCheck, setPaymentCheck] = useState<boolean>(false)
    const [paymentResult, setPaymentResult] = useState<boolean | null>()
    const [paymentError, setPaymentError] = useState<boolean>(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(x => x - 1)
            if (countdown % 10 == 0) {
                hash && requests.check(hash)
                    .then(req => {
                        if (typeof req === 'string') {
                            if (req === 'Success') {
                                setPaymentResult(true);
                                clearInterval(interval)
                            }
                        }
                    })
            }
            if (countdown == 0) {
                clearInterval(interval);
                setPayNext(false)
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [countdown, hash]);

    useEffect(() => {
        hash && setHash(hash);
    }, [hash]);

    useEffect(() => {
        if (payNext && !hash) {
            purchase && purchaseApi.create({
                paymentMethod: purchase.paymentMethod,
                user: purchase.user,
                tickets: purchase.tickets,
                passengers: purchase.passengers,
                isAuth: purchase.isAuth,
            }).then(req => {
                if (typeof req === 'object') {
                    setPaymentError(true);
                } else {
                    setHash(req)
                    purchase && Promise.all([...purchase.passengers, purchase.user].map(usr => {
                        return request.send(usr.email, req)
                    }))
                }
            })
        }
    }, [payNext, purchase]);

    useEffect(() => {
        if (paymentCheck) {
            setPaymentResult(null)
            setLoading(true);
            requests.confirm(hash)
                .then(req => {
                    if (typeof req === "object") {
                        setPaymentError(true)
                        setPaymentResult(false);
                    } else {
                        setPaymentResult(req)
                    }
                    setLoading(false)
                })
        }
    }, [paymentCheck, hash]);

    return (
        <Flex className="w-100">
            <Card bordered={false} className="p-3 w-100">
                {!payNext && !paymentResult && !paymentError && (
                    <>
                        <p className='h5 text-center'>Выберите способ оплаты</p>
                        <Select
                            defaultValue={paymentMethod}
                            className="w-100"
                            onChange={(value) => setPaymentMethod(value)}
                            options={[
                                {value: 'BANKCARD', label: 'Оплата картой на сайте'},
                                {value: 'SBP', label: 'Оплата по QR коду'},
                            ]}
                        />
                        <Button className="w-100 mt-2" onClick={() => {
                            setPayNext(true)
                            setCountdown(180);
                        }}>
                            Далее
                        </Button>
                    </>
                )}
                {payNext && !loading && paymentResult == null && !paymentError && paymentMethod == 'SBP' && (
                    <Flex className='w-100' align='center' justify='center' vertical>
                        <p className='h4 fw-bold text-center'>Для оплаты наведите камеру телефона на QR код</p>
                        <Button type='link' href={`/confirmPay?paymentHash=${hash}`} target='_blank'>
                            Или можете перейти по ссылке
                        </Button>
                        <QRCode
                            className='mb-2'
                            errorLevel={'H'}
                            value={`${window.location.origin}/confirmPay?paymentHash=${hash}`}
                        />
                        <p className="mb-1">Секунд до отмены: <b>{countdown}</b> секунд.</p>
                        <p className='fs-3 m-0'>К оплате {price.toLocaleString()} ₽</p>
                        <Button className="w-100 mt-2" onClick={() => setPayNext(false)} danger>
                            Отмена
                        </Button>
                    </Flex>
                )}
                {payNext && !loading && paymentResult == null && !paymentError && paymentMethod == 'BANKCARD' && (
                    <Flex className='w-100' gap='small' align='center' justify='center' vertical>
                        <p className='h4 fw-bold text-center'>Введите данные банковской карты</p>
                        <BankCard onEnter={() => setCardValid(true)}/>
                        <p className='fs-3 m-0'>К оплате {price.toLocaleString()} ₽</p>
                        <Button type='primary' disabled={!cardValid} onClick={() => {
                            setPaymentCheck(true)
                            setCardValid(false)
                        }}
                                className="w-100 mt-2">
                            Оплатить
                        </Button>
                        <Button className="w-100 mt-2" onClick={() => setPayNext(false)} danger>
                            Отмена
                        </Button>
                    </Flex>
                )}
                {loading && (
                    <Flex justify='center' align='center' gap='middle' vertical>
                        <LoadingOutlined className="h1"/>
                        <Text className='h5'>Загружаем данные с сервера</Text>
                    </Flex>
                )}
                {paymentResult != null && paymentResult && (
                    <Flex justify='center' align='center' gap='middle' vertical>
                        <CheckOutlined className="h1 text-success" />
                        <Text className='h5'>Оплата прошла успешно</Text>
                        <p className='h6 text-wrap text-center'>
                            Ваши билеты отправлены вам на почту, так же вы можете увидеть их в личном кабинете
                        </p>
                    </Flex>
                )}
                {!paymentResult && paymentError && (
                    <Flex justify='center' align='center' gap='middle' vertical>
                        <WarningOutlined className="h1" />
                        <Text className='h5'>При оплате возникла ошибка, повторите операцию</Text>
                        <Button onClick={() => {
                            setPaymentResult(null);
                            setPayNext(false);
                            setCardValid(false);
                            setPaymentCheck(false);
                            setPaymentError(false)
                        }}>
                            Повторить
                        </Button>
                    </Flex>
                )}
            </Card>
        </Flex>
    );
};

export default PaymentPage;