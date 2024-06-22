import {Button, Card, Divider, Flex, Form, FormProps, Input, Steps, Typography} from "antd";
import {useContext, useEffect, useState} from "react";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {CodeForm} from "../PasswordEdit/PasswordEdit.tsx";
import requests from "../../api/Requests/UserApi.ts";
import {UserContext} from "../../main.tsx";
import userApi from "../../api/Requests/UserApi.ts";

const {Text} = Typography;

interface ConfirmTextProps {
    onOk: () => void;
    disabled?: boolean;
    text: string
}

interface TextForm {
    text: string
}

const ConfirmText = ({onOk, disabled, text}: ConfirmTextProps) => {
    const [form] = Form.useForm<TextForm>();
    const [confirm, setConfirm] = useState<boolean>(false);

    const onFinish: FormProps<TextForm>['onFinish'] = (values) => {
        if (values.text !== text) {
            setConfirm(true);
        } else {
            onOk && onOk()
        }
    };

    return (
        <Form
            disabled={disabled}
            form={form}
            onFinish={onFinish}
            className="mb-2 d-flex justify-content-center flex-column align-items-center w-100"
        >
            <p className='h5 text-center'>Подтвердите свои действия</p>
            <p className='h6 text-center'>Введите {text}</p>

            <Form.Item<TextForm>
                name="text"
                rules={[{required: true, message: 'Введите фразу'}]}
                className="w-100 mb-2"
            >
                <Input placeholder='Введите фразу'/>
            </Form.Item>
            {confirm && (
                <Text className='m-0' type='warning'>Пароли должны совпадать!</Text>
            )}
            <Form.Item className='w-100 mb-2'>
                <Button type="primary" htmlType="submit" className='w-100'>
                    Подтвердить
                </Button>
            </Form.Item>
        </Form>
    )
}

const TicketReturnPage = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    const {setNotification, user, jwt} = useContext(UserContext);

    const [steps, setSteps] = useState<0 | 1 | -1>(0);
    const [code, setCode] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);

    useEffect(() => {
        setDisabled(true)
        state && state.ticketId && user && user.email && userApi.sendCodeReturn({
            ticketId: state.ticketId,
            email: user.email
        }).then(req => {
            if (typeof req !== 'object') {
                setDisabled(false)
            } else {
                setSteps(-1)
            }
        })
    }, [state, user]);

    const onEndFirstStep = (code: string) => {
        setDisabled(true)
        requests.checkCodeReturn({
            code: code,
            ticketId: state.ticketId ?? "",
        })
            .then((req) => {
                if (typeof req === 'object') {
                    setSteps(-1)
                } else {
                    setSteps(1);
                    setCode(code);
                    setDisabled(false)
                }
            })
    }

    const onEndSecondStep = () => {
        setDisabled(true)
        jwt && requests.returnTicket({
            ticketId: state.ticketId ?? "",
            code: code,
        }, jwt).then((req) => {
            if (typeof req === 'object') {
                setSteps(-1)
            } else {
                setNotification(<Text>Билет успешно возвращен</Text>)
                navigate("/profile")
            }
        })
    }

    return (
        <Flex className='h-100' justify="center" align="center" gap='small'>
            {steps == -1 && (
                <Card className='p-3' style={{width: '90vmin'}}>
                    <Flex align='center' justify='center' vertical>
                        <Flex justify='center'>
                            <ExclamationCircleOutlined className="h4 me-2"/>
                            <Text className='h3 text-center'>Ошибка соединения с сервером</Text>
                        </Flex>
                        <Text className='h5 text-center' type='secondary'>Попробуйте позже</Text>
                    </Flex>
                </Card>
            )}
            {steps >= 0 && (
                <Card className='p-3' style={{width: 'max-content'}}>
                    <Flex vertical align='center' justify='center'>
                        <p className='h3 fw-bold text-center'>Возврат билета</p>
                        <Divider/>
                        {steps == 0 && <CodeForm disabled={disabled} onOk={onEndFirstStep}/>}
                        {steps == 1 && <ConfirmText disabled={disabled} text="ОТМЕНА" onOk={onEndSecondStep}/>}
                        <Divider/>
                        <Steps
                            size='small'
                            progressDot
                            current={steps}
                            items={[
                                {
                                    title: 'Введите код из письма',
                                },
                                {
                                    title: 'Подтвердите действие',
                                },
                            ]}
                        />
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default TicketReturnPage;