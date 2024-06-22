import {
    Button,
    Card, Collapse,
    DatePicker,
    DatePickerProps,
    Divider,
    Flex,
    Form,
    Input,
    Select, theme,
    Typography
} from "antd";
import {
    useContext,
    useEffect,
    useState
} from "react";
import {UserContext} from "../../main.tsx";
import {
    AgeTicketDataDto,
    AverageCostDataDto,
    CountSalesDto,
    EditUserDto,
    PopularFavorDataDto,
    PurchaseDto,
    QuestionCountDataDto,
    RouteDto,
    TicketDto,
    UserDto, Category, TicketCount, DateParamsDto, MONTHS, Month
} from "../../api/Types/types.ts";
import {useNavigate} from "react-router-dom";
import request from "../../api/Requests/PurchaseApi.ts";
import {default as userRequest} from "../../api/Requests/UserApi.ts"
import {default as statRequest} from "../../api/Requests/StatisticApi.ts"
import ticketApi from "../../api/Requests/TicketApi.ts"
import {WarningOutlined} from "@ant-design/icons";

import dayjs from "dayjs";
import 'dayjs/locale/ru';
dayjs.locale('ru');

import {
    XAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar, Brush, TooltipProps
} from 'recharts';

const {Text} = Typography;

interface UserEditFormProps {
    onEdit?: (user: UserDto, error: boolean) => void;
    loading?: boolean;
    user: UserDto;
}

interface ExtendedPurchaseDto extends PurchaseDto {
    tickets: Array<TicketDto>
}

const UserEditForm = ({onEdit, user, loading}: UserEditFormProps) => {
    const [form] = Form.useForm<UserDto>();

    const onChange = (_changedValues: unknown, values: UserDto) => {
        const errors = form.getFieldsError(
            ['firstName', 'secondName', 'email', 'residenceCity',
                'gender', 'passport', 'internationalPassportNum']
        )
        onEdit && onEdit(values, errors.some(x => x.errors.length > 0))
    }

    useEffect(() => {
        form.setFieldsValue(user)
    }, [form, user]);

    return (
        <Flex gap='small' vertical>
            <Text className='h3 m-0 w-100'>Ваш профиль</Text>
            <small>{user.role}</small>
            <Form
                disabled={loading}
                form={form}
                layout='vertical'
                size='small'
                onValuesChange={onChange}
            >
                <Text type='secondary' className='fs-6'>{user.id}</Text>
                <Divider>Личные данные:</Divider>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Электронная почта'
                    rules={[
                        {type: 'email', message: 'Неверный формат почты!'}
                    ]}
                    name='email'>
                    <Input/>
                </Form.Item>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Имя'
                    rules={[
                        {pattern: /[а-яА-Я]+/, message: "Имя должно содержать только буквы"}
                    ]}
                    name='firstName'>
                    <Input type='string' pattern={"[а-яА-Я]+"}/>
                </Form.Item>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Фамилия'
                    rules={[
                        {pattern: /[а-яА-Я]+/, message: "Фамилия должно содержать только буквы"}
                    ]}
                    name='lastName'>
                    <Input/>
                </Form.Item>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Город'
                    name='residenceCity'>
                    <Input/>
                </Form.Item>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Пол'
                    name='gender'>
                    <Select options={[
                        {label: "Мужской", value: "MALE"},
                        {label: "Женский", value: "FEMALE"},
                    ]}/>
                </Form.Item>
                <Divider>Документы:</Divider>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Паспорт РФ'
                    rules={[
                        {pattern: /\d{10}/, message: "Неверный серия/номер паспорта"}
                    ]}
                    name='passport'>
                    <Input/>
                </Form.Item>
                <Form.Item<UserDto>
                    className='mb-1'
                    label='Международный паспорт'
                    rules={[
                        {pattern: /\d{9}/, message: "Неверный серия/номер паспорта"}
                    ]}
                    name='internationalPassportNum'>
                    <Input/>
                </Form.Item>
            </Form>
        </Flex>
    )
}

const isUsersEquals = (first: UserDto | null, second: UserDto | null) => {
    return first && second && first.firstName === second.firstName
        && second.lastName === second.lastName
        && first.email === second.email
        && first.gender === second.gender
        && first.passport === second.passport
        && first.internationalPassportNum === second.internationalPassportNum
}

const PurchaseView = ({purchase}: { purchase: ExtendedPurchaseDto }) => {
    const navigate = useNavigate()

    return (
        <Card key={purchase.id} className="p-3">
            <Flex vertical>
                <Text className='h4 m-0'>Заказ #{purchase.id}</Text>
                <Divider plain/>
                <Flex gap='small' vertical>
                    {purchase.tickets.map(ticket => (
                        <Card className='p-3 position-relative' key={ticket.id}>
                            {ticket.canReturn && (
                                <Button onClick={() => {
                                    navigate("/return", {
                                        state: {
                                            ticketId: ticket.id
                                        }
                                    })
                                }} className='position-absolute top-0 end-0 m-1'>Вернуть</Button>
                            )}
                            <Flex gap='small' vertical>
                                <Text className='fw-bold'>Билет: #{ticket.id}</Text>
                                <Text>Место: {ticket.ticketType} {ticket.seatNumber}</Text>
                                <Text>Стоимость: {(ticket.costFlight + ticket.costFavors).toLocaleString()} ₽</Text>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
                <Divider plain/>
                <Text className='h5 fw-bold w-100'>Итого: {purchase.totalCost.toLocaleString()} ₽</Text>
                <Text type='secondary' className='h6'>Оплачено с помощью: {purchase.paymentMethod}</Text>
            </Flex>
        </Card>
    )
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<string, number> ) => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    if (active && payload && payload.length) {
        return (
            <Card style={{
                background: `${colorBgContainer}0f`,
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                zIndex: 1000,
            }} className="custom-tooltip p-1">
                <Flex className='' gap='small' vertical>
                    <Text className='fw-bold'>{label}</Text>
                    {payload.map((x, index) => (
                        <Text key={index} className="label fw-bolder">{`${x.name} : ${x.value}`}</Text>
                    ))}
                </Flex>
            </Card>
        );
    }

    return null;
};

const Profile = () => {
    const navigate = useNavigate();
    const {user, city, jwt, setUser, setNotification} = useContext(UserContext);
    const [editableUser, setEditableUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [needUpdate, setNeedUpdate] = useState<boolean>(false);

    const [purchases, setPurchases] = useState<Array<ExtendedPurchaseDto>>([]);
    const [error, setError] = useState<boolean>(false);
    // statistic data
    const [routes, setRoutes] = useState<Array<RouteDto> | null>(null);
    const [questions, setQuestions] = useState<QuestionCountDataDto | null>(null);
    const [popularFavor, setPopularFavor] = useState<PopularFavorDataDto | null>(null);
    const [popularFavorDate, setPopularFavorDate] = useState<DateParamsDto | null>(null);
    const [countSales, setCountSales] = useState<CountSalesDto | null>(null);
    const [countSalesDate, setCountSalesDate] = useState<DateParamsDto | null>(null);
    const [avgCost, setAvgCost] = useState<AverageCostDataDto | null>(null);
    const [ageTicket, setAgeTicket] = useState<AgeTicketDataDto | null>(null);

    useEffect(() => {
        if (user) {
            city && (user.residenceCity = city)
            setEditableUser({
                ...user,
                passport: user.passport && "",
                internationalPassportNum: user.internationalPassportNum && ""
            });
        }
        setLoading(true)
        user && user.id && request.getByUser(user.id)
            .then(req => {
                if (req instanceof Array) {
                    const purchases: Array<ExtendedPurchaseDto> = req
                        .map(x => ({...x, tickets: []}))
                    Promise.all(purchases.map(async (purchase) => {
                        const tickets = await ticketApi.getByPurchase(purchase.id);
                        if (!('code' in tickets)) {
                            purchase.tickets = tickets;
                        }
                    }))
                        .then(() => {
                            setPurchases(purchases)
                        })
                } else {
                    setError(true)
                }
                setLoading(false)
            })
        user && user.role === 'ROLE_ADMIN' && statRequest.topRoute()
            .then(req => {
                if (req instanceof Array) {
                    setRoutes(req);
                }
            })
        user && user.role === 'ROLE_ADMIN' && statRequest.questionCount()
            .then(req => {
                if (!('code' in req)) {
                    const value: QuestionCountDataDto = Object.keys(req.Positive)
                        .map(key => {
                            return [{
                                name: key,
                                positive: req && req.Positive ? req.Positive[key] ?? 0 : 0,
                                negative: req && req.Negative ? req.Negative[key] ?? 0 : 0
                            }]
                        }).flat()
                    setQuestions(value);
                }
            })
        user && user.role === 'ROLE_ADMIN' && statRequest.averageCost()
            .then(req => {
                if (!('code' in req)) {
                    const value: AverageCostDataDto = Object.entries(req.categories)
                        .map((obj) => {
                            const [key, val]: [string, { male: number, female: number }] = obj;
                            return [{
                                category: key as Category,
                                male: val.male ?? 0,
                                female: val.female ?? 0,
                            }]
                        }).flat()
                    setAvgCost(value)
                }
            })
        user && user.role === 'ROLE_ADMIN' && statRequest.ageTicket()
            .then(req => {
                if (!('code' in req)) {
                    const value: AgeTicketDataDto = Object.entries(req.categories)
                        .map(obj => {
                            const [key, val]: [string, { male: TicketCount, female: TicketCount }] = obj;
                            return {
                                category: key as Category,
                                maleEconomic: val.male.ECONOMIC ?? 0,
                                maleBusiness: val.male.BUSINESS ?? 0,
                                femaleEconomic: val.female.ECONOMIC ?? 0,
                                femaleBusiness: val.female.BUSINESS ?? 0,
                            }
                        })
                    setAgeTicket(value)
                }
            })
    }, [user, city]);

    useEffect(() => {
        user && user.role === 'ROLE_ADMIN'
        && popularFavorDate && popularFavorDate.month
        && popularFavorDate.year && statRequest.popularFavor(popularFavorDate)
            .then(req => {
                if (!('code' in req)) {
                    const value: PopularFavorDataDto = Object.entries(req)
                        .map(obj => {
                            const [key, val]: [string, number] = obj
                            return {
                                name: key,
                                value: val
                            }
                        })
                    setPopularFavor(value)
                }
            })
    }, [user, popularFavorDate]);

    useEffect(() => {
        user && user.role === 'ROLE_ADMIN'
        && countSalesDate && countSalesDate.month
        && countSalesDate.year && statRequest.countSale(countSalesDate)
            .then(req => {
                if (!('code' in req)) {
                    setCountSales(req)
                }
            })
    }, [user, countSalesDate]);

    useEffect(() => {
        if (needUpdate) {
            setLoading(true);
            jwt && userRequest.getCurrent(jwt)
                .then(x => {
                    if (!('code' in x)) {
                        setUser(x)
                    }
                    setNeedUpdate(false);
                    setLoading(false);
                })
        }
    }, [needUpdate, jwt, setUser]);

    const onChange = (userValue: UserDto) => {
        setEditableUser(userValue)
    }

    const onDrop = () => {
        if (user) {
            city && (user.residenceCity = city)
            setEditableUser({
                ...user,
                passport: user.passport && "",
                internationalPassportNum: user.internationalPassportNum && ""
            });
        }
    }

    const onSave = () => {
        if (editableUser && user && jwt && user.id) {
            setLoading(true)
            userRequest.edit(user.id, editableUser as EditUserDto, jwt)
                .then(req => {
                    setNotification(typeof req !== 'object'
                        ? <Text className='h5 m-0 text-white'>Успешное обновление данных</Text>
                        : <Text className='h5 m-0 text-white'>Произошла ошибка</Text>)
                    typeof req !== 'object' && setNeedUpdate(true);
                    setLoading(false)
                    setNeedUpdate(true);
                })
        }
    }

    const onChangeDateSales: DatePickerProps['onChange'] = (date) => {
        setCountSales(null)
        setCountSalesDate({
            year: date.year(),
            month: MONTHS[date.month()] as Month ?? "JANUARY"
        })
    }

    const onChangeDateFavors: DatePickerProps['onChange'] = (date) => {
        setPopularFavor(null)
        setPopularFavorDate({
            year: date.year(),
            month: MONTHS[date.month()] as Month ?? "JANUARY"
        })
    }

    return (
        <Flex justify='center' className='h-100 w-100 flex-fill'>
            {editableUser && (
                <Flex gap='small' className='h-100 w-100 flex-wrap flex-md-nowrap'>
                    <Card className='p-3 w-25 flex-fill flex-md-grow-0 h-100' style={{
                        minWidth: '40wv'
                    }}>
                        <Flex vertical gap='small'>
                            <UserEditForm user={editableUser} loading={loading} onEdit={onChange}/>
                            <Divider/>
                            {!isUsersEquals(editableUser, user) && (
                                <Flex gap='small'>
                                    <Button className='flex-fill' onClick={() => onSave()} type='primary'>
                                        Сохранить
                                    </Button>
                                    <Button className='flex-fill' onClick={() => onDrop()}>
                                        Отменить
                                    </Button>
                                </Flex>
                            )}
                            <Button onClick={() => navigate("/editPassword")}>
                                Изменить пароль
                            </Button>
                        </Flex>
                    </Card>
                    <Flex className='flex-fill' gap='small' style={{maxHeight: '100%'}} vertical>
                        {user && user.role === "ROLE_ADMIN" && (
                            <Collapse defaultActiveKey={['1']} items={[
                                {
                                    key: 1,
                                    label: 'Статистика',
                                    forceRender: true,
                                    children: (
                                        <Card bordered={false} className='p-1'>
                                            <Flex gap='small' vertical>
                                                <Flex className='justify-content-between flex-wrap flex-md-nowrap' gap='small'>
                                                    <Card loading={routes === null} className='p-2' style={{flex: 1}}>
                                                        <p>Популярные перелеты</p>
                                                        {routes && (
                                                            <ResponsiveContainer height={120}>
                                                                <BarChart data={routes}>
                                                                    <XAxis dataKey="route"/>
                                                                    <Tooltip content={CustomTooltip}/>
                                                                    <Bar dataKey="ticketCount" fill={"#91caff"}/>
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        )}
                                                    </Card>
                                                    <Card loading={questions === null} className='p-2' style={{flex: 1}}>
                                                        <p>Популярные вопросы</p>
                                                        {questions && (
                                                            <ResponsiveContainer height={120}>
                                                                <BarChart data={questions}>
                                                                    <XAxis dataKey="name"/>
                                                                    <Tooltip content={CustomTooltip}/>
                                                                    <Bar dataKey="positive" fill={"#91caff"}/>
                                                                    <Bar dataKey="negative" fill={"#ffadd2"}/>
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        )}
                                                    </Card>
                                                </Flex>
                                                <Flex className='justify-content-between flex-wrap flex-md-nowrap' gap='small'>
                                                    <Card loading={avgCost === null} className='p-2' style={{flex: 1}}>
                                                        <p>Средняя цена</p>
                                                        {avgCost && (
                                                            <ResponsiveContainer height={180}>
                                                                <BarChart data={avgCost}>
                                                                    <XAxis dataKey="category"/>
                                                                    <Tooltip content={CustomTooltip}/>
                                                                    <Bar dataKey="male" fill={"#91caff"}/>
                                                                    <Bar dataKey="female" fill={"#ffadd2"}/>
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        )}
                                                    </Card>
                                                    <Card loading={ageTicket === null} className='p-2' style={{flex: 1}}>
                                                        <p>Средний возраст</p>
                                                        {ageTicket && (
                                                            <ResponsiveContainer height={180}>
                                                                <BarChart data={ageTicket}>
                                                                    <XAxis dataKey="category"/>
                                                                    <Tooltip content={CustomTooltip}/>
                                                                    <Bar dataKey="maleEconomic" fill={"#91caff"}/>
                                                                    <Bar dataKey="femaleEconomic" fill={"#ffadd2"}/>
                                                                    <Bar dataKey="maleBusiness" fill={"#2f54eb"}/>
                                                                    <Bar dataKey="femaleBusiness" fill={"#eb2f96"}/>
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        )}
                                                    </Card>
                                                </Flex>
                                                <Flex className='justify-content-between flex-wrap flex-md-nowrap' gap='small'>
                                                    <Card className='p-2' style={{flex: 1}}>
                                                        <p>Популярные услуги за месяц</p>
                                                        <DatePicker className={"w-100"} onChange={onChangeDateFavors}
                                                                    picker="month"/>
                                                        <Card bordered={false}
                                                              loading={popularFavor === null}
                                                              className={(popularFavor === null ? "p-1" : "") + " mt-2"}
                                                        >
                                                            {popularFavor && (
                                                                <ResponsiveContainer height={150}>
                                                                    <BarChart data={popularFavor}>
                                                                        <XAxis dataKey="name"/>
                                                                        <Tooltip content={CustomTooltip}/>
                                                                        <Bar dataKey="value" fill={"#91caff"}/>
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            )}
                                                        </Card>
                                                    </Card>
                                                    <Card className='p-2' style={{flex: 1}}>
                                                        <p>Количество покупок за месяц</p>
                                                        <DatePicker className={"w-100"}
                                                                    onChange={onChangeDateSales}
                                                                    picker="month"/>
                                                        <Card bordered={false}
                                                              loading={countSales === null}
                                                              className={(popularFavor === null ? "p-1" : "") + " mt-2"}
                                                        >
                                                            {countSales && (
                                                                <ResponsiveContainer height={150}>
                                                                    <BarChart data={countSales}>
                                                                        <XAxis dataKey="date"/>
                                                                        <Tooltip content={CustomTooltip}/>
                                                                        <Brush dataKey="name" height={30} fill={"#ffffff00"} stroke="#8884d8" />
                                                                        <Bar dataKey="ticketCount" fill={"#91caff"}/>
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            )}
                                                        </Card>
                                                    </Card>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ),
                                }
                            ]}/>
                        )}
                        <Card loading={loading} className='p-3 flex-fill overflow-scroll'>
                            <Flex gap='small' vertical>
                                {error && (
                                    <Flex justify='center' align='center' gap='middle' vertical>
                                        <WarningOutlined className="h1"/>
                                        <Text className='h5'>Возникла непредвиденная ошибка</Text>
                                        <Text type='secondary' className='h6'>Возникла непредвиденная ошибка</Text>
                                    </Flex>
                                )}
                                {!error && purchases && purchases.map(prc => (
                                    <PurchaseView key={prc.id} purchase={prc}/>
                                ))}
                            </Flex>
                        </Card>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};

export default Profile;