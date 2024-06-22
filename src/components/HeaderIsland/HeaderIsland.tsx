import {useContext, useEffect, useState} from 'react';
import {Alert, Button, Divider, Flex, Form, FormProps, Input, Modal, Tooltip, Typography} from "antd";
import {Header} from "antd/es/layout/layout";
import ThemeButton from "../ThemeButton/ThemeButton.tsx";
import {UserOutlined, RobotOutlined, ArrowLeftOutlined, CaretRightOutlined} from '@ant-design/icons'

import './HeaderIsland.css'
import {useNavigate} from "react-router-dom";
import {GeneratePassword} from "js-generate-password";
import {JwtAuthenticationResponse, SignInUser, SignUpUser} from "../../api/Types/types.ts";
import requests from "../../api/Requests/AuthApi.ts";
import {default as userRequest} from "../../api/Requests/UserApi.ts";
import {UserContext} from "../../main.tsx";

const {Text} = Typography;

interface SignInForm {
    onSubmit: () => void
    passwordForgot: () => void;
}

const SignInForm = ({onSubmit, passwordForgot}: SignInForm) => {
    const {setJwt} = useContext(UserContext);
    const [form] = Form.useForm<SignInUser>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const onFinishSignIn: FormProps<SignInUser>['onFinish'] = (values) => {
        setError("")
        setLoading(true)
        requests.signIn(values)
            .then(req => {
                if ('code' in req) {
                    if ((req?.message || "").includes('403')) {
                        setError("Неверный пароль или почта!")
                    } else if ((req?.message || "").includes('400')) {
                        setError("Неверные данные!")
                    } else {
                        setError("Сервер не доступен, попробуйте повторить позже.")
                    }
                } else {
                    const jwt = (req as JwtAuthenticationResponse).token
                    setJwt(jwt)
                    onSubmit && onSubmit()
                }
                setLoading(false)
                form.resetFields()
            })
    };

    return (
        <Form
            disabled={loading}
            form={form}
            name="auth"
            onFinish={onFinishSignIn}
            autoComplete="off"
        >
            {error && <Alert message={error} type="error" className='mb-2'/>}
            <Form.Item<SignInUser>
                name="email"
                rules={[
                    {required: true, message: 'Введите вашу почту!'},
                    {type: 'email', message: 'Неверный формат почты!'}
                ]}
                className="w-100 mb-2"
            >
                <Input placeholder='Почта'/>
            </Form.Item>

            <Form.Item<SignInUser>
                name="password"
                rules={[{required: true, message: 'Введите пароль!'}]}
                className="w-100 mb-2"
            >
                <Input.Password minLength={10} placeholder='Пароль'/>
            </Form.Item>
            <Divider plain>
                <Button type='link' onClick={passwordForgot}>Забыли пароль?</Button>
            </Divider>
            <Form.Item className='w-100 mb-2'>
                <Button type="primary" htmlType="submit" className='w-100'>
                    Войти
                </Button>
            </Form.Item>
        </Form>
    )
}

interface SignUpForm {
    onSubmit: () => void
}

const SignUpForm = ({onSubmit}: SignUpForm) => {
    const [form] = Form.useForm<SignUpUser>()
    const [confirm, setConfirm] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const onFinishSignUp: FormProps<SignUpUser>['onFinish'] = (values) => {
        setError("")
        if (values.password !== values.passwordConfirm) {
            setConfirm(true);
        } else {
            setLoading(true);
            setConfirm(false);
            requests.signUp(values)
                .then(req => {
                    if ('code' in req) {
                        if ((req?.message || "").includes('500')) {
                            setError(`Пользователь с почтой ${values.email} уже существует!`)
                        } else if ((req?.message || "").includes('400')) {
                            setError("Неверные данные!")
                        } else {
                            setError("Сервер не доступен, попробуйте повторить позже.")
                        }
                    } else {
                        onSubmit && onSubmit();
                    }
                    setLoading(false);
                    form.resetFields();
                })
        }
        console.log(values)
    }

    const generatePassword = () => {
        const password = GeneratePassword({
            length: 14,
        });
        form.setFieldValue("password", password);
    }

    return (
        <Form
            disabled={loading}
            form={form}
            onFinish={onFinishSignUp}
            autoComplete="off"
        >
            {error && <Alert message={error} type="error" className='mb-2'/>}
            <Form.Item<SignUpUser>
                name="email"
                rules={[
                    {required: true, message: 'Введите вашу почту!'},
                    {type: 'email', message: 'Неверный формат почты!'}
                ]}
                className="w-100 mb-2"
            >
                <Input placeholder='Почта'/>
            </Form.Item>

            <Form.Item<SignUpUser>
                name="lastName"
                rules={[{required: true, message: 'Введите вашу фамилию'}]}
                className="w-100 mb-2"
            >
                <Input placeholder='Фамилия'/>
            </Form.Item>

            <Form.Item<SignUpUser>
                name="firstName"
                rules={[{required: true, message: 'Введите ваше имя'}]}
                className="w-100 mb-2"
            >
                <Input placeholder='Имя'/>
            </Form.Item>

            <Flex gap='small' className="w-100">
                <Form.Item<SignUpUser>
                    name="password"
                    rules={[{required: true, message: 'Введите пароль!'}]}
                    className="w-100 mb-2"
                >
                    <Input.Password minLength={10} placeholder='Пароль'/>
                </Form.Item>
                <Tooltip title='Сгенерировать пароль'>
                    <Button
                        type='primary'
                        onClick={() => generatePassword()}
                        icon={<RobotOutlined/>}
                    />
                </Tooltip>
            </Flex>

            <Form.Item<SignUpUser>
                name="passwordConfirm"
                rules={[{required: true, message: 'Повторите пароль!'}]}
                className="w-100 mb-2"
            >
                <Input.Password minLength={10} placeholder='Повторите пароль'/>
            </Form.Item>
            {confirm && (
                <Text className='m-0' type='warning'>Пароли должны совпадать!</Text>
            )}

            <Divider/>
            <Form.Item className='w-100 mb-2'>
                <Button type="primary" htmlType="submit" className='w-100'>
                    Регистрация
                </Button>
            </Form.Item>
        </Form>
    )
}

const HeaderIsland = () => {
    const navigate = useNavigate();

    const {jwt, setUser, user, setJwt, notification, setNotification} = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [authState, setAuthState] = useState(true);

    const switchAuthState = () => setAuthState(!authState);

    const onLogout = () => {
        setJwt("")
        setUser(null)
        setNotification(<Text className='h5 m-0 text-white'>
            Успешный выход из аккаунта
        </Text>)
        navigate('/')
    }

    useEffect(() => {
        if (!modalOpen) {
            setAuthState(true);
        }
    }, [modalOpen])

    useEffect(() => {
        jwt && userRequest.getCurrent(jwt)
            .then(x => {
                if (!('code' in x)) {
                    setUser(x)
                }
            })
    }, [jwt, setUser, setJwt]);

    return (
        <Flex justify='center' className="px-3 py-2">
            <Header
                className={"rounded-4 shadow px-4 header_notification " + (notification && "header_notification_on")}
            >
                {notification && (
                    <Flex justify='center' align='center' className='w-100'>{notification}</Flex>
                )}
                {!notification && (
                    <Flex justify='space-between' align='center' className='w-100'>
                        <Flex align='center' className="logo" onClick={() => {
                            navigate('/')
                        }}>
                            <p className='h3 text-white m-0'>Prometei Air</p>
                        </Flex>
                        <Flex gap='small' className="" align='center'>
                            <ThemeButton/>
                            <div className="vr bg-white opacity-100"></div>
                            {user
                                ? (
                                    <>
                                        <Button type="primary"
                                                onClick={() => navigate("/profile")}>{user.firstName}</Button>
                                        <div className="vr bg-white opacity-100"></div>
                                        <Tooltip title='Выйти из аккаунта'>
                                            <Button type='primary' onClick={onLogout} icon={<CaretRightOutlined/>}/>
                                        </Tooltip>
                                    </>
                                )
                                : (<Button type="primary" onClick={() => setModalOpen(true)}>Вход и
                                    Регистрация</Button>)
                            }
                            <Modal
                                centered
                                open={modalOpen}
                                onCancel={() => setModalOpen(false)}
                                footer={null}
                            >
                                {authState
                                    ? (
                                        <>
                                            <p className='h5 w-100 text-center mb-3'>Авторизация</p>
                                            <SignInForm passwordForgot={() => {
                                                setModalOpen(false)
                                                navigate("/editPassword")
                                            }} onSubmit={() => {
                                                setModalOpen(false)
                                                setNotification(<Text className='h5 m-0 text-white'>
                                                    Успешный вход в аккаунт
                                                </Text>)
                                            }}/>
                                            <Flex>
                                                <Button type="dashed" className='w-100' icon={<UserOutlined/>}
                                                        onClick={() => switchAuthState()}>
                                                    Регистрация
                                                </Button>
                                            </Flex>
                                        </>
                                    )
                                    : (
                                        <>
                                            <p className='h5 w-100 text-center mb-3'>Регистрация</p>
                                            <SignUpForm onSubmit={switchAuthState}/>
                                            <Flex>
                                                <Button className='w-100' icon={<ArrowLeftOutlined/>}
                                                        onClick={() => switchAuthState()}>
                                                    Вернуться
                                                </Button>
                                            </Flex>
                                        </>
                                    )}
                            </Modal>
                        </Flex>
                    </Flex>
                )}
            </Header>
        </Flex>
    );
};

export default HeaderIsland;