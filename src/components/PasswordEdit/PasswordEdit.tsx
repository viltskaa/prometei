import {Button, Card, Divider, Flex, Form, FormProps, Input, Steps, Tooltip, Typography} from "antd";
import {useContext, useEffect, useState} from "react";
import {CodeEnterDto, NewPasswordDto, PasswordChangeDto} from "../../api/Types/types.ts";
import requests from "../../api/Requests/AuthApi.ts";
import {ExclamationCircleOutlined, RobotOutlined} from "@ant-design/icons";
import {GeneratePassword} from "js-generate-password";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../main.tsx";

const {Text} = Typography;

interface EmailFormProps {
    onOk: (email: string) => void;
    disabled?: boolean;
}

const EmailForm = ({onOk, disabled}: EmailFormProps) => {
    const [form] = Form.useForm<PasswordChangeDto>();

    const onFinish: FormProps<PasswordChangeDto>['onFinish'] = (values) => {
        onOk && onOk(values.email)
    };

    return (
        <Form
            disabled={disabled}
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className='w-100 flex-fill'
        >
            <Form.Item<PasswordChangeDto>
                label="Электронная почта"
                name="email"
                rules={[
                    {required: true, message: 'Введите вашу почту!'},
                    {type: 'email', message: 'Неверный формат почты!'}
                ]}
                className="w-100 mb-2"
            >
                <Input/>
            </Form.Item>
            <Form.Item className='w-100 mb-2'>
                <Button type="primary" htmlType="submit" className='w-100'>
                    Далее
                </Button>
            </Form.Item>
        </Form>
    )
}

interface CodeFormProps {
    onOk: (code: string) => void;
    disabled?: boolean;
}

export const CodeForm = ({onOk, disabled}: CodeFormProps) => {
    const [form] = Form.useForm<CodeEnterDto>();
    const code = Form.useWatch('code', form)

    const onFinish: FormProps<CodeEnterDto>['onFinish'] = (values) => {
        onOk && onOk(values.code)
    };

    useEffect(() => {
        code && code.length == 6 && onOk(code)
    }, [code, onOk]);

    return (
        <Form
            disabled={disabled}
            form={form}
            onFinish={onFinish}
            className="mb-2 d-flex justify-content-center flex-column align-items-center"
        >
            <p className='h5 text-center'>Введите код из письма</p>
            <Form.Item<CodeEnterDto>
                name="code"
                rules={[
                    {required: true, message: 'Введите код из письма!'},
                ]}
                className="mb-2 d-flex justify-content-center"
            >
                <Input.OTP className='w-100' size='large'/>
            </Form.Item>
        </Form>
    )
}

interface NewPasswordFormProps {
    onOk: (newPassword: NewPasswordDto) => void;
    disabled?: boolean;
}

const NewPasswordForm = ({onOk, disabled}: NewPasswordFormProps) => {
    const [form] = Form.useForm<NewPasswordDto>();
    const [confirm, setConfirm] = useState<boolean>(false);

    const onFinish: FormProps<NewPasswordDto>['onFinish'] = (values) => {
        if (values.newPassword !== values.passwordConfirm) {
            setConfirm(true);
        } else {
            onOk && onOk(values)
        }
    };

    const generatePassword = () => {
        const password = GeneratePassword({
            length: 14,
        });
        form.setFieldValue("newPassword", password);
    }

    return (
        <Form
            disabled={disabled}
            form={form}
            onFinish={onFinish}
            className="mb-2 d-flex justify-content-center flex-column align-items-center w-100"
        >
            <p className='h5 text-center'>Введите новый пароль</p>
            <Flex gap='small' className="w-100">
                <Form.Item<NewPasswordDto>
                    name="newPassword"
                    rules={[{required: true, message: 'Введите пароль!'}]}
                    className="w-100 mb-2"
                >
                    <Input.Password placeholder='Пароль'/>
                </Form.Item>
                <Tooltip title='Сгенерировать пароль'>
                    <Button
                        type='primary'
                        onClick={() => generatePassword()}
                        icon={<RobotOutlined/>}
                    />
                </Tooltip>
            </Flex>

            <Form.Item<NewPasswordDto>
                name="passwordConfirm"
                rules={[{required: true, message: 'Повторите пароль!'}]}
                className="w-100 mb-2"
            >
                <Input.Password placeholder='Повторите пароль'/>
            </Form.Item>
            {confirm && (
                <Text className='m-0' type='warning'>Пароли должны совпадать!</Text>
            )}
            <Form.Item className='w-100 mb-2'>
                <Button type="primary" htmlType="submit" className='w-100'>
                    Далее
                </Button>
            </Form.Item>
        </Form>
    )
}

const PasswordEdit = () => {
    const navigate = useNavigate();
    const {setJwt, setUser} = useContext(UserContext);

    const [steps, setSteps] = useState<0 | 1 | 2 | -1>(0);
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);

    const onEndFirstStep = (email: string) => {
        setDisabled(true)
        requests.sendCode(email)
            .then((req) => {
                if (typeof req === 'object') {
                    setSteps(-1)
                } else {
                    setSteps(1);
                    setEmail(email);
                    setDisabled(false)
                }
            })
    }

    const onEndSecondStep = (code: string) => {
        setDisabled(true)
        requests.check(email, code)
            .then((req) => {
                if (typeof req === 'object') {
                    setSteps(-1)
                } else {
                    setSteps(2);
                    setCode(code);
                    setDisabled(false)
                }
            })
    }

    const onEndThirdStep = (newPassword: NewPasswordDto) => {
        setDisabled(true)
        requests.editPasswordWithCode(
            email,
            code,
            newPassword.newPassword,
            newPassword.passwordConfirm
        ).then((req) => {
            if (typeof req === 'object') {
                setSteps(-1)
            } else {
                setDisabled(false)
                setJwt("")
                setUser(null)
                navigate("/", {
                    state: {
                        notificationState: "Успешное изменение пароля"
                    }
                })
            }
        })
    }

    return (
        <Flex className='h-100' justify="center" align="center" gap='small'>
            {steps == -1 && (
                <Flex align='center' className='h-100' vertical>
                    <Card className='p-3' style={{width: '90vmin'}}>
                        <Flex align='center' justify='center' vertical>
                            <Flex justify='center'>
                                <ExclamationCircleOutlined className="h4 me-2"/>
                                <Text className='h3 text-center'>Ошибка соединения с сервером</Text>
                            </Flex>
                            <Text className='h5 text-center' type='secondary'>Попробуйте позже</Text>
                        </Flex>
                    </Card>
                </Flex>
            )}
            {steps >= 0 && (
                <Card className='p-3' style={{width: 'max-content'}}>
                    <Flex vertical align='center' justify='center'>
                        <p className='h3 fw-bold text-center'>Восстановление пароля</p>
                        <Divider/>
                        {steps == 0 && <EmailForm disabled={disabled} onOk={onEndFirstStep}/>}
                        {steps == 1 && <CodeForm disabled={disabled} onOk={onEndSecondStep}/>}
                        {steps == 2 && (<NewPasswordForm disabled={disabled} onOk={onEndThirdStep}/>)}
                        <Divider/>
                        <Steps
                            className='d-none d-sm-flex'
                            size='small'
                            progressDot
                            current={steps}
                            items={[
                                {
                                    title: 'Введите почту',
                                },
                                {
                                    title: 'Введите код из письма',
                                },
                                {
                                    title: 'Установите новый пароль',
                                },
                            ]}
                        />
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default PasswordEdit;